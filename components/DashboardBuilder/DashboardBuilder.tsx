'use client';

import { Button } from '@/components/UI/button';
import { useDashboardBuilder } from '@/hooks/useDashboardBuilder';
import {
  Download,
  Edit,
  Eye,
  MessageSquare,
  Redo,
  Save,
  TrendingUp,
  Undo,
  Users,
} from 'lucide-react';
import { Suspense, useState } from 'react';

export function DashboardBuilder() {
  const [mode, setMode] = useState<'edit' | 'preview'>('edit');
  const {
    layout,
    onLayoutChange,
    addWidget,
    removeWidget,
    undo,
    redo,
    canUndo,
    canRedo,
    saveDashboard,
    exportDashboard,
  } = useDashboardBuilder();

  return (
    <div className="min-h-screen bg-background">
      {/* Toolbar */}
      <header className="border-b border-border bg-background/95 backdrop-blur">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">Dashboard Builder</h1>

            <div className="flex items-center space-x-2">
              <Button
                variant={mode === 'edit' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setMode('edit')}
              >
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Button>
              <Button
                variant={mode === 'preview' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setMode('preview')}
              >
                <Eye className="h-4 w-4 mr-2" />
                Preview
              </Button>

              <div className="w-px h-6 bg-border mx-2" />

              <Button variant="outline" size="sm" onClick={undo} disabled={!canUndo}>
                <Undo className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={redo} disabled={!canRedo}>
                <Redo className="h-4 w-4" />
              </Button>

              <div className="w-px h-6 bg-border mx-2" />

              <Button variant="outline" size="sm" onClick={exportDashboard}>
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
              <Button size="sm" onClick={saveDashboard}>
                <Save className="h-4 w-4 mr-2" />
                Save
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Widget Palette */}
        {mode === 'edit' && (
          <aside className="w-64 border-r border-border p-4">
            <h3 className="font-semibold mb-4">Widgets</h3>
            <div className="space-y-2">
              {widgetTypes.map((widget) => (
                <Button
                  key={widget.id}
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => addWidget(widget.id)}
                >
                  <widget.icon className="h-4 w-4 mr-2" />
                  {widget.name}
                </Button>
              ))}
            </div>
          </aside>
        )}

        {/* Dashboard Canvas */}
        <main className="flex-1 p-4">
          <Suspense fallback={<div className="animate-pulse bg-muted h-96 rounded" />}></Suspense>

          {layout.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Add widgets from the sidebar to get started</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

const widgetTypes = [
  { id: 'chat-metrics', name: 'Chat Metrics', icon: MessageSquare },
  { id: 'recent-chats', name: 'Recent Chats', icon: Users },
  { id: 'kpi-cards', name: 'KPI Cards', icon: TrendingUp },
  { id: 'quick-prompt', name: 'Quick Prompt', icon: MessageSquare },
];

interface BuilderWidgetProps {
  widgetId: string;
  onRemove: () => void;
}

function BuilderWidget({ widgetId, onRemove }: BuilderWidgetProps) {
  return (
    <div className="h-full flex flex-col">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-medium">
          {widgetTypes.find((w) => w.id === widgetId)?.name || widgetId}
        </span>
        <Button variant="ghost" size="sm" onClick={onRemove} className="h-6 w-6 p-0">
          ×
        </Button>
      </div>
      <div className="flex-1 border border-dashed border-muted-foreground/50 rounded flex items-center justify-center">
        <span className="text-xs text-muted-foreground">Widget Content</span>
      </div>
    </div>
  );
}
