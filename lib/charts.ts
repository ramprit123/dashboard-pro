export function getChartOptions(theme: 'light' | 'dark', customOptions: any = {}) {
  const isDark = theme === 'dark';
  
  const baseOptions = {
    backgroundColor: 'transparent',
    fontName: 'Inter',
    fontSize: 12,
    titleTextStyle: {
      color: isDark ? '#f1f5f9' : '#0f172a',
      fontSize: 16,
      bold: false,
    },
    legendTextStyle: {
      color: isDark ? '#cbd5e1' : '#475569',
    },
    hAxis: {
      textStyle: {
        color: isDark ? '#94a3b8' : '#64748b',
      },
      titleTextStyle: {
        color: isDark ? '#cbd5e1' : '#475569',
      },
      gridlines: {
        color: isDark ? '#334155' : '#e2e8f0',
      },
    },
    vAxis: {
      textStyle: {
        color: isDark ? '#94a3b8' : '#64748b',
      },
      titleTextStyle: {
        color: isDark ? '#cbd5e1' : '#475569',
      },
      gridlines: {
        color: isDark ? '#334155' : '#e2e8f0',
      },
    },
    colors: isDark
      ? ['#60a5fa', '#34d399', '#fbbf24', '#f87171', '#a78bfa']
      : ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'],
    chartArea: {
      left: 60,
      top: 40,
      width: '80%',
      height: '70%',
    },
  };

  // Deep merge custom options
  return mergeDeep(baseOptions, customOptions);
}

function mergeDeep(target: any, source: any): any {
  const output = Object.assign({}, target);
  if (isObject(target) && isObject(source)) {
    Object.keys(source).forEach(key => {
      if (isObject(source[key])) {
        if (!(key in target))
          Object.assign(output, { [key]: source[key] });
        else
          output[key] = mergeDeep(target[key], source[key]);
      } else {
        Object.assign(output, { [key]: source[key] });
      }
    });
  }
  return output;
}

function isObject(item: any): boolean {
  return (item && typeof item === 'object' && !Array.isArray(item));
}