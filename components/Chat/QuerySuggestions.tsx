'use client';

import { Button } from '@/components/UI/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/UI/card';
import { Badge } from '@/components/UI/badge';
import { BarChart3, PieChart, TrendingUp, Phone, Users, Target } from 'lucide-react';

interface QuerySuggestionsProps {
  onQuerySelect: (query: string) => void;
}

export function QuerySuggestions({ onQuerySelect }: QuerySuggestionsProps) {
  const suggestions = [
    {
      category: 'Performance Metrics',
      icon: Target,
      color: 'bg-green-50 border-green-200 text-green-800',
      queries: [
        'Show performance metrics and KPIs',
        'What is our first call resolution rate?',
        'Analyze customer satisfaction scores',
      ],
    },
    {
      category: 'Department Analysis',
      icon: Users,
      color: 'bg-blue-50 border-blue-200 text-blue-800',
      queries: [
        'Show department breakdown',
        'Which departments handle the most calls?',
        'Department performance analysis',
      ],
    },
    {
      category: 'Call Categories',
      icon: PieChart,
      color: 'bg-orange-50 border-orange-200 text-orange-800',
      queries: [
        'Analyze call categories and types',
        'Show call category breakdown',
        'What are the most common issues?',
      ],
    },
    {
      category: 'Time Trends',
      icon: TrendingUp,
      color: 'bg-purple-50 border-purple-200 text-purple-800',
      queries: [
        'Show hourly call volume trends',
        'Daily call center performance',
        'Peak hours analysis',
      ],
    },
    {
      category: 'Priority & Escalation',
      icon: BarChart3,
      color: 'bg-red-50 border-red-200 text-red-800',
      queries: ['Show priority analysis', 'Analyze escalation rates', 'Urgent calls breakdown'],
    },
    {
      category: 'Call Records',
      icon: BarChart3,
      color: 'bg-gray-50 border-gray-200 text-gray-800',
      queries: [
        'Show all call records',
        'Call details with filters',
        'Agent performance data',
        'Test table',
      ],
    },
  ];

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Phone className="h-5 w-5" />
          Call Center Query Suggestions
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Click on any suggestion to see charts, tables, and insights
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {suggestions.map((category, categoryIndex) => (
            <div key={categoryIndex}>
              <div className="flex items-center gap-2 mb-3">
                <category.icon className="h-4 w-4" />
                <Badge variant="outline" className={category.color}>
                  {category.category}
                </Badge>
              </div>
              <div className="grid gap-2">
                {category.queries.map((query, queryIndex) => (
                  <Button
                    key={queryIndex}
                    variant="ghost"
                    className="justify-start h-auto p-3 text-left hover:bg-muted"
                    onClick={() => onQuerySelect(query)}
                  >
                    <div>
                      <p className="text-sm font-medium">{query}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Will generate charts, tables, and insights
                      </p>
                    </div>
                  </Button>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 p-4 bg-muted/50 rounded-lg">
          <h4 className="font-medium mb-2">💡 Pro Tips:</h4>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>• Ask about specific KPIs like "resolution rate" or "average handle time"</li>
            <li>• Request comparisons: "Compare department performance"</li>
            <li>• Ask for trends: "Show hourly call volume trends"</li>
            <li>• Get recommendations: "How to improve first call resolution?"</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
