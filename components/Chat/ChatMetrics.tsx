'use client';

import { useChat } from '@/hooks/useChat';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/UI/card';
import { GoogleChartWrapper } from '../Chart/GoogleChartWrapper';

export function ChatMetrics() {
  const { messages } = useChat();

  const messagesByHour = messages.reduce(
    (acc, message) => {
      const hour = new Date(message.timestamp).getHours();
      acc[hour] = (acc[hour] || 0) + 1;
      return acc;
    },
    {} as Record<number, number>
  );

  const chartData = [
    ['Hour', 'Messages'],
    ...Array.from({ length: 24 }, (_, i) => [`${i}:00`, messagesByHour[i] || 0]),
  ];

  const responseTimeData = [
    ['Response', 'Time (ms)'],
    ['Average', 150],
    ['P95', 300],
    ['P99', 500],
  ];

  const cards = [
    {
      id: 'response-times',
      title: 'Response Times',
      type: 'chart',
      content: (
        <GoogleChartWrapper
          chartType="ColumnChart"
          data={responseTimeData}
          options={{
            title: '',
            vAxis: { title: 'Time (ms)' },
          }}
          height="100%"
          width="100%"
        />
      ),
    },
    {
      id: 'messages-by-hour',
      title: 'Messages by Hour',
      type: 'chart',
      content: (
        <GoogleChartWrapper
          chartType="LineChart"
          data={chartData}
          options={{
            title: '',
            hAxis: { title: 'Hour of Day' },
            vAxis: { title: 'Message Count' },
          }}
          height="100%"
          width="100%"
        />
      ),
    },
    {
      id: 'quick-stats',
      title: 'Quick Stats',
      type: 'content',
      content: (
        <div className="space-y-3 md:space-y-4">
          <div className="flex justify-between items-center p-3 md:p-4 bg-muted/50 rounded-lg">
            <span className="text-xs md:text-sm text-muted-foreground">Total Messages</span>
            <span className="text-xl md:text-2xl font-bold">{messages.length}</span>
          </div>
          <div className="flex justify-between items-center p-3 md:p-4 bg-muted/50 rounded-lg">
            <span className="text-xs md:text-sm text-muted-foreground">Active Conversations</span>
            <span className="text-xl md:text-2xl font-bold">1</span>
          </div>
          <div className="flex justify-between items-center p-3 md:p-4 bg-muted/50 rounded-lg">
            <span className="text-xs md:text-sm text-muted-foreground">Average Response</span>
            <span className="text-xl md:text-2xl font-bold">150ms</span>
          </div>
        </div>
      ),
    },
    {
      id: 'user-activity',
      title: 'User Activity',
      type: 'content',
      content: (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="text-center p-3 md:p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
              <div className="text-xl md:text-2xl font-bold text-blue-600 dark:text-blue-400">
                24
              </div>
              <div className="text-xs md:text-sm text-muted-foreground">Hours Active</div>
            </div>
            <div className="text-center p-3 md:p-4 bg-green-50 dark:bg-green-950 rounded-lg">
              <div className="text-xl md:text-2xl font-bold text-green-600 dark:text-green-400">
                95%
              </div>
              <div className="text-xs md:text-sm text-muted-foreground">Uptime</div>
            </div>
          </div>
          <div className="p-3 md:p-4 bg-muted/50 rounded-lg">
            <div className="text-xs md:text-sm text-muted-foreground mb-2">Peak Hours</div>
            <div className="text-base md:text-lg font-semibold">2:00 PM - 4:00 PM</div>
          </div>
        </div>
      ),
    },
    {
      id: 'performance',
      title: 'Performance Metrics',
      type: 'content',
      content: (
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>CPU Usage</span>
              <span>45%</span>
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <div className="bg-blue-500 h-2 rounded-full" style={{ width: '45%' }}></div>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Memory Usage</span>
              <span>62%</span>
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <div className="bg-green-500 h-2 rounded-full" style={{ width: '62%' }}></div>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Network I/O</span>
              <span>28%</span>
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '28%' }}></div>
            </div>
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="h-full">
      <ScrollArea className="h-full">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-2 gap-4 p-4 md:p-6">
          {cards.map((card) => (
            <Card
              key={card.id}
              className={`${
                card.type === 'chart'
                  ? 'flex flex-col md:col-span-2 xl:col-span-3 2xl:col-span-2 min-h-[300px] md:min-h-[400px]'
                  : 'min-h-[200px] md:min-h-[250px]'
              }`}
            >
              <CardHeader className="pb-3">
                <CardTitle className="text-lg md:text-xl">{card.title}</CardTitle>
              </CardHeader>
              <CardContent className={card.type === 'chart' ? 'flex-1 min-h-0' : 'flex-1'}>
                {card.content}
              </CardContent>
            </Card>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
