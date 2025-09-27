'use client';

import { useState, useMemo } from 'react';
import { Input } from '@/components/UI/input';
import { Button } from '@/components/UI/button';
import { ScrollArea } from '@/components/UI/scroll-area';
import { Badge } from '@/components/UI/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/UI/select';
import { ChevronUp, ChevronDown, Search, Filter, X, ArrowUpDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DataTableProps {
  data: Record<string, any>[];
  headers: string[];
  title: string;
  className?: string;
}

type SortDirection = 'asc' | 'desc' | null;

interface SortConfig {
  key: string;
  direction: SortDirection;
}

export function DataTable({ data, headers, title, className }: DataTableProps) {
  const [globalFilter, setGlobalFilter] = useState('');
  const [columnFilters, setColumnFilters] = useState<Record<string, string>>({});
  const [sortConfig, setSortConfig] = useState<SortConfig>({ key: '', direction: null });
  const [showFilters, setShowFilters] = useState(false);

  // Debug logging
  console.log('DataTable props:', { data, headers, title });
  console.log('Data length:', data?.length);
  console.log('Headers:', headers);

  // Early return if no data
  if (!data || !Array.isArray(data) || data.length === 0) {
    return (
      <div className={cn('space-y-4', className)}>
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">{title}</h3>
          <Badge variant="outline">0 rows</Badge>
        </div>
        <div className="border rounded-lg p-8 text-center text-muted-foreground">
          No data available to display
        </div>
      </div>
    );
  }

  // Get unique values for each column for filter dropdowns
  const getUniqueValues = (columnKey: string) => {
    const values = data.map((row) => String(row[columnKey] || '')).filter(Boolean);
    return Array.from(new Set(values)).sort();
  };

  // Sort data
  const sortedData = useMemo(() => {
    if (!sortConfig.key || !sortConfig.direction) return data;

    return [...data].sort((a, b) => {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];

      // Handle numeric sorting
      const aNum = parseFloat(String(aValue).replace(/[^\d.-]/g, ''));
      const bNum = parseFloat(String(bValue).replace(/[^\d.-]/g, ''));

      if (!isNaN(aNum) && !isNaN(bNum)) {
        return sortConfig.direction === 'asc' ? aNum - bNum : bNum - aNum;
      }

      // Handle string sorting
      const aStr = String(aValue).toLowerCase();
      const bStr = String(bValue).toLowerCase();

      if (sortConfig.direction === 'asc') {
        return aStr.localeCompare(bStr);
      } else {
        return bStr.localeCompare(aStr);
      }
    });
  }, [data, sortConfig]);

  // Filter data
  const filteredData = useMemo(() => {
    let filtered = sortedData;

    // Apply global filter
    if (globalFilter) {
      filtered = filtered.filter((row) =>
        headers.some((header) =>
          String(row[header] || '')
            .toLowerCase()
            .includes(globalFilter.toLowerCase())
        )
      );
    }

    // Apply column filters
    Object.entries(columnFilters).forEach(([column, filterValue]) => {
      if (filterValue) {
        filtered = filtered.filter((row) =>
          String(row[column] || '')
            .toLowerCase()
            .includes(filterValue.toLowerCase())
        );
      }
    });

    return filtered;
  }, [sortedData, globalFilter, columnFilters, headers]);

  const handleSort = (columnKey: string) => {
    setSortConfig((prevConfig) => {
      if (prevConfig.key === columnKey) {
        // Cycle through: asc -> desc -> null
        const newDirection =
          prevConfig.direction === 'asc' ? 'desc' : prevConfig.direction === 'desc' ? null : 'asc';
        return { key: columnKey, direction: newDirection };
      } else {
        return { key: columnKey, direction: 'asc' };
      }
    });
  };

  const handleColumnFilter = (column: string, value: string) => {
    setColumnFilters((prev) => ({
      ...prev,
      [column]: value === 'all' ? '' : value,
    }));
  };

  const clearFilters = () => {
    setGlobalFilter('');
    setColumnFilters({});
    setSortConfig({ key: '', direction: null });
  };

  const getSortIcon = (columnKey: string) => {
    if (sortConfig.key !== columnKey) {
      return <ArrowUpDown className="h-4 w-4 text-muted-foreground" />;
    }
    if (sortConfig.direction === 'asc') {
      return <ChevronUp className="h-4 w-4 text-primary" />;
    }
    if (sortConfig.direction === 'desc') {
      return <ChevronDown className="h-4 w-4 text-primary" />;
    }
    return <ArrowUpDown className="h-4 w-4 text-muted-foreground" />;
  };

  const activeFiltersCount =
    Object.values(columnFilters).filter(Boolean).length + (globalFilter ? 1 : 0);

  return (
    <div className={cn('space-y-4', className)}>
      {/* Header with Search and Filter Controls */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">{title}</h3>
          <div className="flex items-center gap-2">
            <Badge variant="outline">
              {filteredData.length} of {data.length} rows
            </Badge>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
              className="relative"
            >
              <Filter className="h-4 w-4 mr-2" />
              Filters
              {activeFiltersCount > 0 && (
                <Badge variant="destructive" className="ml-2 h-5 w-5 p-0 text-xs">
                  {activeFiltersCount}
                </Badge>
              )}
            </Button>
            {activeFiltersCount > 0 && (
              <Button variant="ghost" size="sm" onClick={clearFilters}>
                <X className="h-4 w-4 mr-2" />
                Clear
              </Button>
            )}
          </div>
        </div>

        {/* Global Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search across all columns..."
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Column Filters */}
        {showFilters && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4 bg-muted/50 rounded-lg">
            {headers.map((header) => {
              const uniqueValues = getUniqueValues(header);
              if (uniqueValues.length <= 1) return null;

              return (
                <div key={header} className="space-y-2">
                  <label className="text-sm font-medium">{header}</label>
                  <Select
                    value={columnFilters[header] || 'all'}
                    onValueChange={(value) => handleColumnFilter(header, value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="All" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All</SelectItem>
                      {uniqueValues.map((value) => (
                        <SelectItem key={value} value={value}>
                          {value}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Table */}
      <ScrollArea className="h-[400px] border rounded-lg">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead className="sticky top-0 bg-background z-10">
              <tr className="border-b">
                {headers.map((header) => (
                  <th
                    key={header}
                    className="text-left p-4 font-medium cursor-pointer hover:bg-muted/50 transition-colors"
                    onClick={() => handleSort(header)}
                  >
                    <div className="flex items-center gap-2">
                      <span>{header}</span>
                      {getSortIcon(header)}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredData.length === 0 ? (
                <tr>
                  <td colSpan={headers.length} className="text-center p-8 text-muted-foreground">
                    No data found matching your filters
                  </td>
                </tr>
              ) : (
                filteredData.map((row, index) => (
                  <tr key={index} className="border-b hover:bg-muted/50 transition-colors">
                    {headers.map((header) => (
                      <td key={header} className="p-4 whitespace-nowrap">
                        {String(row[header] || '')}
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </ScrollArea>

      {/* Footer with Stats */}
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <div>
          Showing {filteredData.length} of {data.length} entries
          {globalFilter && ` (filtered by "${globalFilter}")`}
        </div>
        {sortConfig.direction && (
          <div>
            Sorted by {sortConfig.key} (
            {sortConfig.direction === 'asc' ? 'ascending' : 'descending'})
          </div>
        )}
      </div>
    </div>
  );
}
