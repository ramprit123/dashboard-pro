'use client';

import { ScrollArea } from '@/components/UI/scroll-area';

interface SimpleTableProps {
  data: Record<string, any>[];
  headers: string[];
  title: string;
}

export function SimpleTable({ data, headers, title }: SimpleTableProps) {
  console.log('SimpleTable received:', { data, headers, title });

  if (!data || !Array.isArray(data) || data.length === 0) {
    return (
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">{title}</h3>
        <div className="border rounded-lg p-8 text-center text-muted-foreground">
          No data available to display
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">{title}</h3>
      <div className="text-sm text-muted-foreground">Showing {data.length} rows</div>
      <ScrollArea className="h-[400px] border rounded-lg">
        <table className="w-full border-collapse">
          <thead className="sticky top-0 bg-background">
            <tr className="border-b">
              {headers.map((header, index) => (
                <th key={index} className="text-left p-4 font-medium border-r">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, rowIndex) => (
              <tr key={rowIndex} className="border-b hover:bg-muted/50">
                {headers.map((header, cellIndex) => (
                  <td key={cellIndex} className="p-4 border-r">
                    {String(row[header] || '')}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </ScrollArea>
    </div>
  );
}
