'use client';

import { create } from 'zustand';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

interface Dashboard {
  id: string;
  name: string;
  layout: Array<{
    i: string;
    x: number;
    y: number;
    w: number;
    h: number;
  }>;
  widgets: string[];
}

interface DashboardState {
  currentDashboard: Dashboard | null;
  dashboards: Dashboard[];
  setCurrentDashboard: (dashboard: Dashboard) => void;
  setDashboards: (dashboards: Dashboard[]) => void;
}

const useDashboardStore = create<DashboardState>((set) => ({
  currentDashboard: null,
  dashboards: [],
  setCurrentDashboard: (dashboard) => set({ currentDashboard: dashboard }),
  setDashboards: (dashboards) => set({ dashboards }),
}));

export function useDashboard() {
  const queryClient = useQueryClient();
  const { currentDashboard, dashboards, setCurrentDashboard, setDashboards } = useDashboardStore();

  // Fetch dashboards
  const { isLoading } = useQuery({
    queryKey: ['dashboards'],
    queryFn: async () => {
      const response = await fetch('/api/dashboards');
      if (!response.ok) throw new Error('Failed to fetch dashboards');
      const data = await response.json();
      setDashboards(data.dashboards);
      if (data.dashboards.length > 0 && !currentDashboard) {
        setCurrentDashboard(data.dashboards[0]);
      }
      return data.dashboards;
    },
  });

  // Save dashboard mutation
  const saveMutation = useMutation({
    mutationFn: async (dashboard: Dashboard) => {
      const response = await fetch('/api/dashboards', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dashboard),
      });
      if (!response.ok) throw new Error('Failed to save dashboard');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dashboards'] });
    },
  });

  const selectDashboard = (dashboardId: string) => {
    const dashboard = dashboards.find(d => d.id === dashboardId);
    if (dashboard) {
      setCurrentDashboard(dashboard);
    }
  };

  const saveDashboard = () => {
    if (currentDashboard) {
      saveMutation.mutate(currentDashboard);
    }
  };

  const exportDashboard = () => {
    if (currentDashboard) {
      const dataStr = JSON.stringify(currentDashboard, null, 2);
      const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
      
      const exportFileDefaultName = `${currentDashboard.name}.json`;
      
      const linkElement = document.createElement('a');
      linkElement.setAttribute('href', dataUri);
      linkElement.setAttribute('download', exportFileDefaultName);
      linkElement.click();
    }
  };

  return {
    currentDashboard,
    dashboards,
    layout: currentDashboard?.layout || [],
    isLoading,
    selectDashboard,
    saveDashboard,
    exportDashboard,
    isSaving: saveMutation.isPending,
  };
}