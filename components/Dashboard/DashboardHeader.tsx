'use client';

import { Button } from '@/components/UI/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/UI/select';
import { Download, Edit, Save, Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useDashboard } from '@/hooks/useDashboard';
import { UserProfile } from '@/components/user-profile';

export function DashboardHeader() {
  const router = useRouter();
  const { currentDashboard, dashboards, selectDashboard, saveDashboard, exportDashboard } =
    useDashboard();

  return (
    <header className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold">Dashboard</h1>
            <Select value={currentDashboard?.id} onValueChange={selectDashboard}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Select dashboard" />
              </SelectTrigger>
              <SelectContent>
                {dashboards.map((dashboard) => (
                  <SelectItem key={dashboard.id} value={dashboard.id}>
                    {dashboard.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" onClick={() => router.push('/dashboard/builder')}>
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Button>
            <Button variant="outline" size="sm" onClick={saveDashboard}>
              <Save className="h-4 w-4 mr-2" />
              Save
            </Button>
            <Button variant="outline" size="sm" onClick={exportDashboard}>
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button size="sm" onClick={() => router.push('/dashboard/builder')}>
              <Plus className="h-4 w-4 mr-2" />
              New
            </Button>
            <UserProfile />
          </div>
        </div>
      </div>
    </header>
  );
}
