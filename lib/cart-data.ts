// Call Center Dashboard Data Types
export interface CallRecord {
  id: string;
  customerId: string;
  agentId: string;
  agentName: string;
  department: string;
  callType: 'inbound' | 'outbound';
  category: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'open' | 'in-progress' | 'resolved' | 'escalated' | 'closed';
  startTime: string;
  endTime?: string;
  duration?: number; // in minutes
  resolutionTime?: number; // in minutes
  customerSatisfaction?: number; // 1-5 scale
  firstCallResolution: boolean;
  transferCount: number;
  notes: string;
}

export interface AgentMetrics {
  agentId: string;
  agentName: string;
  department: string;
  totalCalls: number;
  averageHandleTime: number;
  firstCallResolution: number;
  customerSatisfaction: number;
  callsResolved: number;
  callsEscalated: number;
  availabilityHours: number;
}

export const sampleCallCenterData: CallRecord[] = [
  {
    id: 'call_001',
    customerId: 'cust_123',
    agentId: 'agent_001',
    agentName: 'Sarah Johnson',
    department: 'Technical Support',
    callType: 'inbound',
    category: 'Technical Issue',
    priority: 'high',
    status: 'resolved',
    startTime: '2024-01-15T09:30:00Z',
    endTime: '2024-01-15T09:45:00Z',
    duration: 15,
    resolutionTime: 15,
    customerSatisfaction: 5,
    firstCallResolution: true,
    transferCount: 0,
    notes: 'Customer had login issues, resolved by password reset',
  },
  {
    id: 'call_002',
    customerId: 'cust_456',
    agentId: 'agent_002',
    agentName: 'Mike Chen',
    department: 'Billing',
    callType: 'inbound',
    category: 'Billing Inquiry',
    priority: 'medium',
    status: 'resolved',
    startTime: '2024-01-15T10:15:00Z',
    endTime: '2024-01-15T10:28:00Z',
    duration: 13,
    resolutionTime: 13,
    customerSatisfaction: 4,
    firstCallResolution: true,
    transferCount: 0,
    notes: 'Billing dispute resolved, refund processed',
  },
  {
    id: 'call_003',
    customerId: 'cust_789',
    agentId: 'agent_003',
    agentName: 'Emily Rodriguez',
    department: 'Sales',
    callType: 'outbound',
    category: 'Follow-up',
    priority: 'low',
    status: 'closed',
    startTime: '2024-01-15T11:00:00Z',
    endTime: '2024-01-15T11:12:00Z',
    duration: 12,
    resolutionTime: 12,
    customerSatisfaction: 4,
    firstCallResolution: true,
    transferCount: 0,
    notes: 'Follow-up on recent purchase, customer satisfied',
  },
  {
    id: 'call_004',
    customerId: 'cust_101',
    agentId: 'agent_001',
    agentName: 'Sarah Johnson',
    department: 'Technical Support',
    callType: 'inbound',
    category: 'Technical Issue',
    priority: 'urgent',
    status: 'escalated',
    startTime: '2024-01-15T14:30:00Z',
    endTime: '2024-01-15T15:15:00Z',
    duration: 45,
    resolutionTime: undefined,
    customerSatisfaction: 2,
    firstCallResolution: false,
    transferCount: 2,
    notes: 'Complex technical issue escalated to Level 2 support',
  },
  {
    id: 'call_005',
    customerId: 'cust_202',
    agentId: 'agent_004',
    agentName: 'David Kim',
    department: 'Customer Service',
    callType: 'inbound',
    category: 'General Inquiry',
    priority: 'low',
    status: 'resolved',
    startTime: '2024-01-15T16:00:00Z',
    endTime: '2024-01-15T16:08:00Z',
    duration: 8,
    resolutionTime: 8,
    customerSatisfaction: 5,
    firstCallResolution: true,
    transferCount: 0,
    notes: 'Product information inquiry, customer satisfied',
  },
  {
    id: 'call_006',
    customerId: 'cust_303',
    agentId: 'agent_002',
    agentName: 'Mike Chen',
    department: 'Billing',
    callType: 'inbound',
    category: 'Billing Inquiry',
    priority: 'medium',
    status: 'in-progress',
    startTime: '2024-01-15T16:30:00Z',
    duration: undefined,
    resolutionTime: undefined,
    customerSatisfaction: undefined,
    firstCallResolution: false,
    transferCount: 0,
    notes: 'Currently investigating billing discrepancy',
  },
];

export interface ChartData {
  chartType: 'ColumnChart' | 'LineChart' | 'PieChart' | 'BarChart' | 'AreaChart';
  data: any[][];
  options: any;
  title: string;
}

export interface TableData {
  headers: string[];
  rows: any[][];
  data: Record<string, any>[]; // Array of objects for enhanced table functionality
  title: string;
}

export interface AnalyticsResponse {
  chartData?: ChartData;
  tableData?: TableData;
  textResponse: string;
  kpis?: Array<{
    label: string;
    value: string | number;
    change?: string;
    trend?: 'up' | 'down' | 'neutral';
  }>;
}

export function getCallCenterAnalytics() {
  const totalCalls = sampleCallCenterData.length;
  const resolvedCalls = sampleCallCenterData.filter((call) => call.status === 'resolved').length;
  const inProgressCalls = sampleCallCenterData.filter(
    (call) => call.status === 'in-progress'
  ).length;
  const escalatedCalls = sampleCallCenterData.filter((call) => call.status === 'escalated').length;

  const completedCalls = sampleCallCenterData.filter((call) => call.duration !== undefined);
  const avgHandleTime =
    completedCalls.length > 0
      ? completedCalls.reduce((sum, call) => sum + (call.duration || 0), 0) / completedCalls.length
      : 0;

  const firstCallResolutionRate =
    (sampleCallCenterData.filter((call) => call.firstCallResolution).length / totalCalls) * 100;

  const satisfactionRatings = sampleCallCenterData.filter(
    (call) => call.customerSatisfaction !== undefined
  );
  const avgSatisfaction =
    satisfactionRatings.length > 0
      ? satisfactionRatings.reduce((sum, call) => sum + (call.customerSatisfaction || 0), 0) /
        satisfactionRatings.length
      : 0;

  const categoryBreakdown = sampleCallCenterData.reduce(
    (acc, call) => {
      acc[call.category] = (acc[call.category] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

  const departmentBreakdown = sampleCallCenterData.reduce(
    (acc, call) => {
      acc[call.department] = (acc[call.department] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

  const priorityBreakdown = sampleCallCenterData.reduce(
    (acc, call) => {
      acc[call.priority] = (acc[call.priority] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

  return {
    totalCalls,
    resolvedCalls,
    inProgressCalls,
    escalatedCalls,
    avgHandleTime,
    firstCallResolutionRate,
    avgSatisfaction,
    categoryBreakdown,
    departmentBreakdown,
    priorityBreakdown,
    resolutionRate: (resolvedCalls / totalCalls) * 100,
    escalationRate: (escalatedCalls / totalCalls) * 100,
  };
}
// Validation function for table data
function validateTableData(tableData: TableData): TableData {
  if (!tableData.data || !Array.isArray(tableData.data)) {
    console.warn('Table data is missing or not an array:', tableData);
    tableData.data = [];
  }
  if (!tableData.headers || !Array.isArray(tableData.headers)) {
    console.warn('Table headers are missing or not an array:', tableData);
    tableData.headers = [];
  }
  return tableData;
}

export function generateChartAndTableData(
  query: string,
  analytics: ReturnType<typeof getCallCenterAnalytics>
): AnalyticsResponse {
  const lowerQuery = query.toLowerCase();

  // Test query for debugging
  if (lowerQuery.includes('test table')) {
    return {
      chartData: {
        chartType: 'ColumnChart',
        title: 'Test Chart',
        data: [
          ['Item', 'Count'],
          ['Test 1', 10],
          ['Test 2', 20],
        ],
        options: {
          title: 'Test Chart',
          vAxis: { title: 'Count' },
          chartArea: { width: '80%', height: '70%' },
        },
      },
      tableData: {
        title: 'Test Table',
        headers: ['Name', 'Value', 'Status'],
        rows: [
          ['Test Item 1', '100', 'Active'],
          ['Test Item 2', '200', 'Inactive'],
          ['Test Item 3', '300', 'Pending'],
        ],
        data: [
          { Name: 'Test Item 1', Value: '100', Status: 'Active', ValueNumber: 100 },
          { Name: 'Test Item 2', Value: '200', Status: 'Inactive', ValueNumber: 200 },
          { Name: 'Test Item 3', Value: '300', Status: 'Pending', ValueNumber: 300 },
        ],
      },
      textResponse: 'This is a test response with both chart and table data.',
      kpis: [
        { label: 'Test KPI 1', value: '100', trend: 'up' as const },
        { label: 'Test KPI 2', value: '200', trend: 'down' as const },
      ],
    };
  }

  // Call Center KPIs
  const kpis = [
    { label: 'Total Calls', value: analytics.totalCalls, trend: 'neutral' as const },
    {
      label: 'Resolution Rate',
      value: `${analytics.resolutionRate.toFixed(1)}%`,
      trend: 'up' as const,
    },
    {
      label: 'Avg Handle Time',
      value: `${analytics.avgHandleTime.toFixed(1)}m`,
      trend: 'down' as const,
    },
    {
      label: 'Customer Satisfaction',
      value: `${analytics.avgSatisfaction.toFixed(1)}/5`,
      trend: 'up' as const,
    },
  ];

  // Call Volume by Department
  if (
    lowerQuery.includes('department') ||
    lowerQuery.includes('team') ||
    lowerQuery.includes('breakdown')
  ) {
    const departmentData = Object.entries(analytics.departmentBreakdown).sort(
      ([, a], [, b]) => b - a
    );

    const tableData = validateTableData({
      title: 'Department Performance',
      headers: ['Department', 'Total Calls', 'Percentage'],
      rows: departmentData.map(([department, calls]) => [
        department,
        calls,
        `${((calls / analytics.totalCalls) * 100).toFixed(1)}%`,
      ]),
      data: departmentData.map(([department, calls]) => ({
        Department: department,
        'Total Calls': calls,
        Percentage: `${((calls / analytics.totalCalls) * 100).toFixed(1)}%`,
        PercentageValue: (calls / analytics.totalCalls) * 100, // For sorting
      })),
    });

    return {
      chartData: {
        chartType: 'PieChart',
        title: 'Call Volume by Department',
        data: [['Department', 'Calls'], ...departmentData],
        options: {
          title: 'Call Distribution by Department',
          pieHole: 0.4,
          colors: ['#4285F4', '#34A853', '#FBBC04', '#EA4335', '#9AA0A6'],
          chartArea: { width: '90%', height: '80%' },
        },
      },
      tableData,
      textResponse: `📊 **Department Analysis:**\n\nCall volume by department:\n${departmentData
        .map(([dept, calls]) => `• ${dept}: ${calls} calls`)
        .join(
          '\n'
        )}\n\nThis shows workload distribution across departments and can help with resource allocation.`,
      kpis,
    };
  }

  // Call Categories Analysis
  if (
    lowerQuery.includes('category') ||
    lowerQuery.includes('issue') ||
    lowerQuery.includes('type')
  ) {
    const categoryData = Object.entries(analytics.categoryBreakdown).sort(([, a], [, b]) => b - a);

    return {
      chartData: {
        chartType: 'ColumnChart',
        title: 'Call Categories',
        data: [['Category', 'Count'], ...categoryData],
        options: {
          title: 'Call Volume by Category',
          vAxis: { title: 'Number of Calls' },
          hAxis: { title: 'Category' },
          colors: ['#4285F4', '#34A853', '#FBBC04', '#EA4335'],
          chartArea: { width: '80%', height: '70%' },
        },
      },
      tableData: {
        title: 'Call Categories Breakdown',
        headers: ['Category', 'Count', 'Percentage'],
        rows: categoryData.map(([category, count]) => [
          category,
          count,
          `${((count / analytics.totalCalls) * 100).toFixed(1)}%`,
        ]),
        data: categoryData.map(([category, count]) => ({
          Category: category,
          Count: count,
          Percentage: `${((count / analytics.totalCalls) * 100).toFixed(1)}%`,
          PercentageValue: (count / analytics.totalCalls) * 100, // For sorting
        })),
      },
      textResponse: `📋 **Category Analysis:**\n\nTop call categories:\n${categoryData
        .slice(0, 3)
        .map(([cat, count]) => `• ${cat}: ${count} calls`)
        .join('\n')}\n\nThis helps identify common customer issues and training needs.`,
      kpis,
    };
  }

  // Priority Analysis
  if (
    lowerQuery.includes('priority') ||
    lowerQuery.includes('urgent') ||
    lowerQuery.includes('escalation')
  ) {
    const priorityData = Object.entries(analytics.priorityBreakdown).sort(([, a], [, b]) => b - a);

    return {
      chartData: {
        chartType: 'PieChart',
        title: 'Call Priority Distribution',
        data: [['Priority', 'Count'], ...priorityData],
        options: {
          title: 'Calls by Priority Level',
          colors: ['#EA4335', '#FBBC04', '#4285F4', '#34A853'],
          pieHole: 0.3,
          chartArea: { width: '90%', height: '80%' },
        },
      },
      tableData: {
        title: 'Priority Analysis',
        headers: ['Priority', 'Count', 'Percentage', 'Escalation Rate'],
        rows: priorityData.map(([priority, count]) => {
          const percentage = ((count / analytics.totalCalls) * 100).toFixed(1);
          const escalationRate = priority === 'urgent' ? '45%' : priority === 'high' ? '25%' : '5%';
          return [priority, count, `${percentage}%`, escalationRate];
        }),
        data: priorityData.map(([priority, count]) => {
          const percentage = ((count / analytics.totalCalls) * 100).toFixed(1);
          const escalationRateValue = priority === 'urgent' ? 45 : priority === 'high' ? 25 : 5;
          return {
            Priority: priority,
            Count: count,
            Percentage: `${percentage}%`,
            PercentageValue: parseFloat(percentage),
            'Escalation Rate': `${escalationRateValue}%`,
            EscalationRateValue: escalationRateValue,
          };
        }),
      },
      textResponse: `🚨 **Priority Analysis:**\n\n• Escalation Rate: ${analytics.escalationRate.toFixed(1)}%\n• High Priority Calls: ${analytics.priorityBreakdown.high || 0}\n• Urgent Calls: ${analytics.priorityBreakdown.urgent || 0}\n\n**Action Items:**\n• Monitor urgent calls closely\n• Ensure proper escalation procedures\n• Review high-priority resolution times`,
      kpis,
    };
  }

  // Performance Metrics
  if (
    lowerQuery.includes('performance') ||
    lowerQuery.includes('resolution') ||
    lowerQuery.includes('satisfaction') ||
    lowerQuery.includes('fcr')
  ) {
    const performanceData = [
      ['First Call Resolution', analytics.firstCallResolutionRate],
      ['Resolution Rate', analytics.resolutionRate],
      ['Customer Satisfaction', analytics.avgSatisfaction * 20], // Convert to percentage
      ['Escalation Rate', analytics.escalationRate],
    ];

    return {
      chartData: {
        chartType: 'ColumnChart',
        title: 'Key Performance Metrics',
        data: [['Metric', 'Percentage'], ...performanceData],
        options: {
          title: 'Call Center Performance KPIs',
          vAxis: { title: 'Percentage (%)', minValue: 0, maxValue: 100 },
          hAxis: { title: 'Metrics' },
          colors: ['#34A853', '#4285F4', '#FBBC04', '#EA4335'],
          chartArea: { width: '80%', height: '70%' },
        },
      },
      tableData: {
        title: 'Performance Metrics',
        headers: ['Metric', 'Value', 'Target', 'Status'],
        rows: [
          [
            'First Call Resolution',
            `${analytics.firstCallResolutionRate.toFixed(1)}%`,
            '80%',
            analytics.firstCallResolutionRate >= 80 ? '✅ Good' : '⚠️ Needs Improvement',
          ],
          [
            'Resolution Rate',
            `${analytics.resolutionRate.toFixed(1)}%`,
            '95%',
            analytics.resolutionRate >= 95 ? '✅ Good' : '⚠️ Needs Improvement',
          ],
          [
            'Avg Handle Time',
            `${analytics.avgHandleTime.toFixed(1)}m`,
            '12m',
            analytics.avgHandleTime <= 12 ? '✅ Good' : '⚠️ Above Target',
          ],
          [
            'Customer Satisfaction',
            `${analytics.avgSatisfaction.toFixed(1)}/5`,
            '4.0',
            analytics.avgSatisfaction >= 4.0 ? '✅ Good' : '⚠️ Needs Improvement',
          ],
        ],
        data: [
          {
            Metric: 'First Call Resolution',
            Value: `${analytics.firstCallResolutionRate.toFixed(1)}%`,
            ValueNumber: analytics.firstCallResolutionRate,
            Target: '80%',
            TargetNumber: 80,
            Status: analytics.firstCallResolutionRate >= 80 ? '✅ Good' : '⚠️ Needs Improvement',
            StatusValue: analytics.firstCallResolutionRate >= 80 ? 1 : 0,
          },
          {
            Metric: 'Resolution Rate',
            Value: `${analytics.resolutionRate.toFixed(1)}%`,
            ValueNumber: analytics.resolutionRate,
            Target: '95%',
            TargetNumber: 95,
            Status: analytics.resolutionRate >= 95 ? '✅ Good' : '⚠️ Needs Improvement',
            StatusValue: analytics.resolutionRate >= 95 ? 1 : 0,
          },
          {
            Metric: 'Avg Handle Time',
            Value: `${analytics.avgHandleTime.toFixed(1)}m`,
            ValueNumber: analytics.avgHandleTime,
            Target: '12m',
            TargetNumber: 12,
            Status: analytics.avgHandleTime <= 12 ? '✅ Good' : '⚠️ Above Target',
            StatusValue: analytics.avgHandleTime <= 12 ? 1 : 0,
          },
          {
            Metric: 'Customer Satisfaction',
            Value: `${analytics.avgSatisfaction.toFixed(1)}/5`,
            ValueNumber: analytics.avgSatisfaction,
            Target: '4.0',
            TargetNumber: 4.0,
            Status: analytics.avgSatisfaction >= 4.0 ? '✅ Good' : '⚠️ Needs Improvement',
            StatusValue: analytics.avgSatisfaction >= 4.0 ? 1 : 0,
          },
        ],
      },
      textResponse: `📈 **Performance Insights:**\n\n• First Call Resolution: ${analytics.firstCallResolutionRate.toFixed(1)}%\n• Average Handle Time: ${analytics.avgHandleTime.toFixed(1)} minutes\n• Customer Satisfaction: ${analytics.avgSatisfaction.toFixed(1)}/5\n• Resolution Rate: ${analytics.resolutionRate.toFixed(1)}%\n\n**Recommendations:** Focus on improving first call resolution to reduce handle time and increase satisfaction.`,
      kpis,
    };
  }

  // Time-based Analysis (mock data for demonstration)
  if (
    lowerQuery.includes('time') ||
    lowerQuery.includes('trend') ||
    lowerQuery.includes('daily') ||
    lowerQuery.includes('hourly')
  ) {
    const timeData = [
      ['9 AM', 15, 12],
      ['10 AM', 22, 18],
      ['11 AM', 28, 24],
      ['12 PM', 35, 30],
      ['1 PM', 32, 28],
      ['2 PM', 25, 22],
      ['3 PM', 30, 26],
      ['4 PM', 20, 18],
    ];

    return {
      chartData: {
        chartType: 'LineChart',
        title: 'Hourly Call Volume',
        data: [['Hour', 'Incoming Calls', 'Resolved Calls'], ...timeData],
        options: {
          title: 'Daily Call Volume Trends',
          vAxis: { title: 'Number of Calls' },
          hAxis: { title: 'Hour of Day' },
          colors: ['#4285F4', '#34A853'],
          chartArea: { width: '80%', height: '70%' },
          curveType: 'function',
        },
      },
      tableData: {
        title: 'Hourly Call Trends',
        headers: ['Hour', 'Incoming', 'Resolved', 'Resolution Rate'],
        rows: timeData.map(([hour, incoming, resolved]) => [
          hour,
          incoming,
          resolved,
          `${(((resolved as number) / (incoming as number)) * 100).toFixed(1)}%`,
        ]),
        data: timeData.map(([hour, incoming, resolved]) => ({
          Hour: hour,
          Incoming: incoming,
          Resolved: resolved,
          'Resolution Rate': `${(((resolved as number) / (incoming as number)) * 100).toFixed(1)}%`,
          ResolutionRateValue: ((resolved as number) / (incoming as number)) * 100,
        })),
      },
      textResponse: `📈 **Time-based Trends:**\n\n• Peak hours: 12 PM - 1 PM\n• Best resolution rate: 11 AM (85.7%)\n• Lowest volume: 4 PM\n\n**Insights:** Lunch hours show highest call volume. Consider staffing adjustments during peak times.`,
      kpis,
    };
  }

  // Agent Performance Analysis
  if (
    lowerQuery.includes('agent performance') ||
    lowerQuery.includes('agent data') ||
    lowerQuery.includes('agent metrics')
  ) {
    const agentPerformance = sampleCallCenterData.reduce(
      (acc, call) => {
        if (!acc[call.agentId]) {
          acc[call.agentId] = {
            agentId: call.agentId,
            agentName: call.agentName,
            department: call.department,
            totalCalls: 0,
            resolvedCalls: 0,
            totalDuration: 0,
            satisfactionSum: 0,
            satisfactionCount: 0,
            fcrCount: 0,
          };
        }

        acc[call.agentId].totalCalls++;
        if (call.status === 'resolved') acc[call.agentId].resolvedCalls++;
        if (call.duration) acc[call.agentId].totalDuration += call.duration;
        if (call.customerSatisfaction) {
          acc[call.agentId].satisfactionSum += call.customerSatisfaction;
          acc[call.agentId].satisfactionCount++;
        }
        if (call.firstCallResolution) acc[call.agentId].fcrCount++;

        return acc;
      },
      {} as Record<string, any>
    );

    const agentData = Object.values(agentPerformance).map((agent: any) => ({
      Agent: agent.agentName,
      Department: agent.department,
      'Total Calls': agent.totalCalls,
      'Resolved Calls': agent.resolvedCalls,
      'Resolution Rate': `${((agent.resolvedCalls / agent.totalCalls) * 100).toFixed(1)}%`,
      ResolutionRateValue: (agent.resolvedCalls / agent.totalCalls) * 100,
      'Avg Handle Time': `${(agent.totalDuration / agent.totalCalls).toFixed(1)}m`,
      AvgHandleTimeValue: agent.totalDuration / agent.totalCalls,
      'Customer Satisfaction':
        agent.satisfactionCount > 0
          ? `${(agent.satisfactionSum / agent.satisfactionCount).toFixed(1)}/5`
          : 'N/A',
      SatisfactionValue:
        agent.satisfactionCount > 0 ? agent.satisfactionSum / agent.satisfactionCount : 0,
      'FCR Rate': `${((agent.fcrCount / agent.totalCalls) * 100).toFixed(1)}%`,
      FCRRateValue: (agent.fcrCount / agent.totalCalls) * 100,
    }));

    return {
      chartData: {
        chartType: 'ColumnChart',
        title: 'Agent Performance - Total Calls',
        data: [
          ['Agent', 'Total Calls'],
          ...agentData.map((agent) => [agent.Agent, agent['Total Calls']]),
        ],
        options: {
          title: 'Total Calls by Agent',
          vAxis: { title: 'Number of Calls' },
          hAxis: { title: 'Agent' },
          colors: ['#4285F4'],
          chartArea: { width: '80%', height: '70%' },
        },
      },
      tableData: {
        title: 'Agent Performance Metrics',
        headers: [
          'Agent',
          'Department',
          'Total Calls',
          'Resolved Calls',
          'Resolution Rate',
          'Avg Handle Time',
          'Customer Satisfaction',
          'FCR Rate',
        ],
        rows: agentData.map((agent) => [
          agent.Agent,
          agent.Department,
          agent['Total Calls'],
          agent['Resolved Calls'],
          agent['Resolution Rate'],
          agent['Avg Handle Time'],
          agent['Customer Satisfaction'],
          agent['FCR Rate'],
        ]),
        data: agentData,
      },
      textResponse: `👥 **Agent Performance Analysis:**\n\n• Total Agents: ${agentData.length}\n• Best Resolution Rate: ${Math.max(...agentData.map((a) => a.ResolutionRateValue)).toFixed(1)}%\n• Best FCR Rate: ${Math.max(...agentData.map((a) => a.FCRRateValue)).toFixed(1)}%\n\n**Use the table to:**\n• Sort by any performance metric\n• Filter by department\n• Compare agent performance\n• Identify top performers`,
      kpis,
    };
  }

  // Call Details/Records Analysis
  if (
    lowerQuery.includes('call details') ||
    lowerQuery.includes('call records') ||
    lowerQuery.includes('all calls') ||
    lowerQuery.includes('call list')
  ) {
    return {
      chartData: {
        chartType: 'ColumnChart',
        title: 'Call Status Distribution',
        data: [
          ['Status', 'Count'],
          ['Resolved', analytics.resolvedCalls],
          ['In Progress', analytics.inProgressCalls],
          ['Escalated', analytics.escalatedCalls],
        ],
        options: {
          title: 'Call Status Distribution',
          vAxis: { title: 'Number of Calls' },
          colors: ['#34A853', '#FBBC04', '#EA4335'],
          chartArea: { width: '80%', height: '70%' },
        },
      },
      tableData: {
        title: 'Call Center Records',
        headers: [
          'Call ID',
          'Agent',
          'Department',
          'Category',
          'Priority',
          'Status',
          'Duration',
          'Satisfaction',
          'FCR',
        ],
        rows: sampleCallCenterData.map((call) => [
          call.id,
          call.agentName,
          call.department,
          call.category,
          call.priority,
          call.status,
          call.duration ? `${call.duration}m` : 'N/A',
          call.customerSatisfaction ? `${call.customerSatisfaction}/5` : 'N/A',
          call.firstCallResolution ? 'Yes' : 'No',
        ]),
        data: sampleCallCenterData.map((call) => ({
          'Call ID': call.id,
          Agent: call.agentName,
          Department: call.department,
          Category: call.category,
          Priority: call.priority,
          Status: call.status,
          Duration: call.duration ? `${call.duration}m` : 'N/A',
          DurationValue: call.duration || 0,
          Satisfaction: call.customerSatisfaction ? `${call.customerSatisfaction}/5` : 'N/A',
          SatisfactionValue: call.customerSatisfaction || 0,
          FCR: call.firstCallResolution ? 'Yes' : 'No',
          FCRValue: call.firstCallResolution ? 1 : 0,
          'Start Time': new Date(call.startTime).toLocaleString(),
          'End Time': call.endTime ? new Date(call.endTime).toLocaleString() : 'N/A',
          Notes: call.notes,
        })),
      },
      textResponse: `📋 **Call Records Analysis:**\n\n• Total Records: ${sampleCallCenterData.length}\n• Resolved: ${analytics.resolvedCalls}\n• In Progress: ${analytics.inProgressCalls}\n• Escalated: ${analytics.escalatedCalls}\n\n**Use the table filters to:**\n• Filter by department, status, or priority\n• Search for specific agents or call IDs\n• Sort by duration, satisfaction, or any column\n• View detailed call information`,
      kpis,
    };
  }

  // Default comprehensive overview
  return {
    chartData: {
      chartType: 'ColumnChart',
      title: 'Call Center Overview',
      data: [
        ['Metric', 'Count'],
        ['Total Calls', analytics.totalCalls],
        ['Resolved', analytics.resolvedCalls],
        ['In Progress', analytics.inProgressCalls],
        ['Escalated', analytics.escalatedCalls],
      ],
      options: {
        title: 'Call Status Overview',
        vAxis: { title: 'Number of Calls' },
        colors: ['#4285F4', '#34A853', '#FBBC04', '#EA4335'],
        chartArea: { width: '80%', height: '70%' },
      },
    },
    tableData: {
      title: 'Call Center Summary',
      headers: ['Metric', 'Value'],
      rows: [
        ['Total Calls', analytics.totalCalls],
        ['Resolved Calls', analytics.resolvedCalls],
        ['In Progress', analytics.inProgressCalls],
        ['Escalated Calls', analytics.escalatedCalls],
        ['Resolution Rate', `${analytics.resolutionRate.toFixed(1)}%`],
        ['Avg Handle Time', `${analytics.avgHandleTime.toFixed(1)} minutes`],
        ['Customer Satisfaction', `${analytics.avgSatisfaction.toFixed(1)}/5`],
        ['First Call Resolution', `${analytics.firstCallResolutionRate.toFixed(1)}%`],
      ],
      data: [
        { Metric: 'Total Calls', Value: analytics.totalCalls, ValueNumber: analytics.totalCalls },
        {
          Metric: 'Resolved Calls',
          Value: analytics.resolvedCalls,
          ValueNumber: analytics.resolvedCalls,
        },
        {
          Metric: 'In Progress',
          Value: analytics.inProgressCalls,
          ValueNumber: analytics.inProgressCalls,
        },
        {
          Metric: 'Escalated Calls',
          Value: analytics.escalatedCalls,
          ValueNumber: analytics.escalatedCalls,
        },
        {
          Metric: 'Resolution Rate',
          Value: `${analytics.resolutionRate.toFixed(1)}%`,
          ValueNumber: analytics.resolutionRate,
        },
        {
          Metric: 'Avg Handle Time',
          Value: `${analytics.avgHandleTime.toFixed(1)} minutes`,
          ValueNumber: analytics.avgHandleTime,
        },
        {
          Metric: 'Customer Satisfaction',
          Value: `${analytics.avgSatisfaction.toFixed(1)}/5`,
          ValueNumber: analytics.avgSatisfaction,
        },
        {
          Metric: 'First Call Resolution',
          Value: `${analytics.firstCallResolutionRate.toFixed(1)}%`,
          ValueNumber: analytics.firstCallResolutionRate,
        },
      ],
    },
    textResponse: `📞 **Call Center Dashboard Overview:**\n\n**Key Metrics:**\n• Total Calls: ${analytics.totalCalls}\n• Resolution Rate: ${analytics.resolutionRate.toFixed(1)}%\n• Avg Handle Time: ${analytics.avgHandleTime.toFixed(1)} minutes\n• Customer Satisfaction: ${analytics.avgSatisfaction.toFixed(1)}/5\n\n**Ask me about:**\n• "Show department breakdown"\n• "Analyze call categories"\n• "Performance metrics"\n• "Priority analysis"\n• "Hourly call trends"`,
    kpis,
  };
}
