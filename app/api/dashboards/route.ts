import { NextRequest, NextResponse } from 'next/server';

// Mock dashboard data - in production, this would connect to your database
const mockDashboards = [
  {
    id: 'default',
    name: 'Default Dashboard',
    layout: [
      { i: 'chat-metrics', x: 0, y: 0, w: 6, h: 4 },
      { i: 'recent-chats', x: 6, y: 0, w: 6, h: 4 },
      { i: 'kpi-cards', x: 0, y: 4, w: 12, h: 2 },
    ],
    widgets: ['chat-metrics', 'recent-chats', 'kpi-cards'],
  },
];

export async function GET() {
  return NextResponse.json({ dashboards: mockDashboards });
}

export async function POST(request: NextRequest) {
  try {
    const dashboardData = await request.json();

    const savedDashboard = {
      ...dashboardData,
      id: dashboardData.id || `dashboard_${Date.now()}`,
      updatedAt: new Date().toISOString(),
    };

    return NextResponse.json(savedDashboard);
  } catch (error) {
    console.error('Dashboard save error:', error);
    return NextResponse.json({ error: 'Failed to save dashboard' }, { status: 500 });
  }
}
