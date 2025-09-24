'use client';

import { useState, useCallback } from 'react';
import { create } from 'zustand';
import type { Layout } from 'react-grid-layout';

interface BuilderState {
  layout: Layout[];
  history: Layout[][];
  historyIndex: number;
  setLayout: (layout: Layout[]) => void;
  pushToHistory: (layout: Layout[]) => void;
  undo: () => void;
  redo: () => void;
}

const useBuilderStore = create<BuilderState>((set, get) => ({
  layout: [],
  history: [[]],
  historyIndex: 0,
  setLayout: (layout) => set({ layout }),
  pushToHistory: (layout) => {
    const { history, historyIndex } = get();
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(layout);
    set({
      history: newHistory,
      historyIndex: newHistory.length - 1,
      layout,
    });
  },
  undo: () => {
    const { history, historyIndex } = get();
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      set({
        historyIndex: newIndex,
        layout: history[newIndex],
      });
    }
  },
  redo: () => {
    const { history, historyIndex } = get();
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      set({
        historyIndex: newIndex,
        layout: history[newIndex],
      });
    }
  },
}));

export function useDashboardBuilder() {
  const { 
    layout, 
    setLayout, 
    pushToHistory, 
    undo, 
    redo, 
    history, 
    historyIndex 
  } = useBuilderStore();

  const onLayoutChange = useCallback((newLayout: Layout[]) => {
    setLayout(newLayout);
    // Debounce history updates to avoid too many entries
    const timeoutId = setTimeout(() => {
      pushToHistory(newLayout);
    }, 500);
    return () => clearTimeout(timeoutId);
  }, [setLayout, pushToHistory]);

  const addWidget = useCallback((widgetType: string) => {
    const newWidget: Layout = {
      i: `${widgetType}_${Date.now()}`,
      x: 0,
      y: 0,
      w: 4,
      h: 3,
    };

    // Find empty position
    const positions = layout.map(item => ({ x: item.x, y: item.y, w: item.w, h: item.h }));
    let x = 0, y = 0;
    let found = false;

    while (!found) {
      let collision = false;
      for (const pos of positions) {
        if (
          x < pos.x + pos.w &&
          x + newWidget.w > pos.x &&
          y < pos.y + pos.h &&
          y + newWidget.h > pos.y
        ) {
          collision = true;
          break;
        }
      }
      
      if (!collision) {
        found = true;
        newWidget.x = x;
        newWidget.y = y;
      } else {
        x += 2;
        if (x > 8) {
          x = 0;
          y += 2;
        }
      }
    }

    const newLayout = [...layout, newWidget];
    setLayout(newLayout);
    pushToHistory(newLayout);
  }, [layout, setLayout, pushToHistory]);

  const removeWidget = useCallback((widgetId: string) => {
    const newLayout = layout.filter(item => item.i !== widgetId);
    setLayout(newLayout);
    pushToHistory(newLayout);
  }, [layout, setLayout, pushToHistory]);

  const saveDashboard = useCallback(async () => {
    try {
      const dashboard = {
        id: 'custom_dashboard',
        name: 'Custom Dashboard',
        layout,
        widgets: layout.map(item => item.i),
      };

      const response = await fetch('/api/dashboards', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dashboard),
      });

      if (!response.ok) throw new Error('Failed to save dashboard');
      
      // TODO: Show success message
      console.log('Dashboard saved successfully');
    } catch (error) {
      console.error('Failed to save dashboard:', error);
      // TODO: Show error message
    }
  }, [layout]);

  const exportDashboard = useCallback(() => {
    const dashboard = {
      layout,
      widgets: layout.map(item => item.i),
      exportedAt: new Date().toISOString(),
    };

    const dataStr = JSON.stringify(dashboard, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', 'dashboard-layout.json');
    linkElement.click();
  }, [layout]);

  return {
    layout,
    onLayoutChange,
    addWidget,
    removeWidget,
    undo,
    redo,
    canUndo: historyIndex > 0,
    canRedo: historyIndex < history.length - 1,
    saveDashboard,
    exportDashboard,
  };
}