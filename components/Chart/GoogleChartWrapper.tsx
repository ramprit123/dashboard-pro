'use client';

import { useTheme } from 'next-themes';
import { getChartOptions } from '@/lib/charts';
import { useEffect, useState, useRef } from 'react';
import dynamic from 'next/dynamic';
import { GoogleChartWrapperChartType } from 'react-google-charts';

const Chart = dynamic(() => import('react-google-charts').then((mod) => ({ default: mod.Chart })), {
  ssr: false,
  loading: () => (
    <div className="animate-pulse bg-muted rounded w-full h-full min-h-[300px] flex items-center justify-center">
      Loading chart...
    </div>
  ),
});

interface GoogleChartWrapperProps {
  chartType: GoogleChartWrapperChartType;
  data: any[][];
  options?: any;
  width?: string | number;
  height?: string | number;
}

export function GoogleChartWrapper({
  chartType,
  data,
  options = {},
  width = '100%',
  height = 'auto',
}: GoogleChartWrapperProps) {
  const { theme, systemTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [chartHeight, setChartHeight] = useState<number>(622);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const updateHeight = () => {
      if (containerRef.current && height === '100%') {
        // Get the parent container (CardContent)
        const parentElement = containerRef.current.parentElement;
        if (parentElement) {
          const parentRect = parentElement.getBoundingClientRect();
          const availableHeight = parentRect.height;
          const calculatedHeight = Math.max(availableHeight - 40, 600);
          setChartHeight(calculatedHeight);
        }
      }
    };

    if (mounted && height === '100%') {
      const timeouts = [100, 300, 500, 1000];
      timeouts.forEach((delay) => {
        setTimeout(updateHeight, delay);
      });

      // Update on resize
      window.addEventListener('resize', updateHeight);

      // Use ResizeObserver for container changes
      const resizeObserver = new ResizeObserver(() => {
        setTimeout(updateHeight, 50);
      });

      if (containerRef.current?.parentElement) {
        resizeObserver.observe(containerRef.current.parentElement);
      }

      return () => {
        window.removeEventListener('resize', updateHeight);
        resizeObserver.disconnect();
      };
    }
  }, [mounted, height]);

  if (!mounted) {
    return <div className="animate-pulse bg-muted rounded w-full h-full min-h-[300px]" />;
  }

  const currentTheme = theme === 'system' ? systemTheme : theme;
  const chartOptions = getChartOptions(currentTheme as 'light' | 'dark', options);

  const isFullSize = height === '100%';
  const finalHeight = isFullSize ? chartHeight : height;

  return (
    <div
      ref={containerRef}
      className={`w-full ${isFullSize ? 'h-full flex flex-col' : ''}`}
      style={isFullSize ? { minHeight: `${chartHeight}px` } : {}}
    >
      <Chart
        chartType={chartType}
        data={data}
        options={{
          ...chartOptions,
          ...options,
          chartArea: {
            left: 60,
            top: 40,
            width: '80%',
            height: '75%',
            ...options.chartArea,
          },
        }}
        width={width}
        height={finalHeight}
        loader={
          <div
            className="animate-pulse bg-muted rounded w-full flex items-center justify-center"
            style={{ height: `${chartHeight}px` }}
          >
            Loading chart...
          </div>
        }
      />
    </div>
  );
}
