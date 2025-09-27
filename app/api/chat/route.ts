import { NextRequest, NextResponse } from 'next/server';
import { OpenRouterClient, createCartAnalysisPrompt } from '@/lib/openrouter';
import {
  sampleCallCenterData,
  getCallCenterAnalytics,
  generateChartAndTableData,
  type AnalyticsResponse,
} from '@/lib/cart-data';

function createFallbackResponse(message: string, callData: any): string {
  const analytics = getCallCenterAnalytics();

  // Simple pattern matching for common questions
  const lowerMessage = message.toLowerCase();

  if (lowerMessage.includes('resolution') || lowerMessage.includes('resolve')) {
    return `Based on your call center data analysis:

📊 **Resolution Insights:**
- Resolution Rate: ${analytics.resolutionRate.toFixed(1)}%
- Total Resolved Calls: ${analytics.resolvedCalls}
- First Call Resolution: ${analytics.firstCallResolutionRate.toFixed(1)}%
- Average Handle Time: ${analytics.avgHandleTime.toFixed(1)} minutes

💡 **Recommendations:**
- Focus on improving first call resolution
- Provide additional training for complex issues
- Review escalation procedures
- Monitor agent performance metrics`;
  }

  if (lowerMessage.includes('department') || lowerMessage.includes('team')) {
    const departments = Object.entries(analytics.departmentBreakdown)
      .sort(([, a], [, b]) => (b as number) - (a as number))
      .map(([dept, count]) => `- ${dept}: ${count} calls`)
      .join('\n');

    return `📈 **Department Analysis:**

${departments}

This shows workload distribution across departments and can help with resource allocation.`;
  }

  if (
    lowerMessage.includes('satisfaction') ||
    lowerMessage.includes('customer') ||
    lowerMessage.includes('csat')
  ) {
    return `💰 **Customer Satisfaction Analysis:**
- Average Satisfaction: ${analytics.avgSatisfaction.toFixed(1)}/5
- Total Calls: ${analytics.totalCalls}
- Resolved Calls: ${analytics.resolvedCalls}
- Escalated Calls: ${analytics.escalatedCalls}

This data shows your current customer satisfaction performance and areas for improvement.`;
  }

  // Default response with general insights
  return `📞 **Call Center Dashboard Summary:**

**Overview:**
- Total Calls: ${analytics.totalCalls}
- Resolved: ${analytics.resolvedCalls} | In Progress: ${analytics.inProgressCalls}
- Resolution Rate: ${analytics.resolutionRate.toFixed(1)}%
- Average Handle Time: ${analytics.avgHandleTime.toFixed(1)} minutes

**Top Departments:**
${Object.entries(analytics.departmentBreakdown)
  .sort(([, a], [, b]) => (b as number) - (a as number))
  .slice(0, 3)
  .map(([dept, count]) => `- ${dept}: ${count} calls`)
  .join('\n')}

Ask me specific questions about resolution rates, departments, or performance metrics for more detailed insights!`;
}

export async function POST(request: NextRequest) {
  try {
    const { message, conversationId, includeCallData = true } = await request.json();

    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    // Prepare data for analysis
    const callCenterAnalytics = getCallCenterAnalytics();
    const dataContext = {
      calls: sampleCallCenterData,
      analytics: callCenterAnalytics,
    };

    const apiKey = process.env.OPENROUTER_API_KEY;

    // Try OpenRouter first, fallback to local analysis if it fails
    let analyticsResponse: AnalyticsResponse;
    let usage = undefined;

    if (apiKey && !includeCallData) {
      // For non-call center queries, try OpenRouter
      try {
        const client = new OpenRouterClient(apiKey);
        const messages = [{ role: 'user' as const, content: message }];
        const response = await client.createChatCompletion(messages);

        if ('choices' in response && response.choices.length > 0) {
          analyticsResponse = {
            textResponse: response.choices[0].message.content,
          };
          usage = response.usage;
        } else {
          throw new Error('No response from AI');
        }
      } catch (openRouterError) {
        console.error('OpenRouter API Error:', openRouterError);
        // Use fallback response based on the message
        analyticsResponse = {
          textResponse: createFallbackResponse(message, dataContext),
        };
      }
    } else {
      // For call center data queries, always use local analysis with chart/table generation
      analyticsResponse = generateChartAndTableData(message, callCenterAnalytics);

      // The local analysis already provides comprehensive responses with charts and tables
      // No need to call OpenRouter for call center data queries as we have all the data locally
      console.log('Using local call center analytics for query:', message);
    }

    const chatResponse = {
      id: `msg_${Date.now()}`,
      message: analyticsResponse.textResponse,
      timestamp: new Date().toISOString(),
      conversationId: conversationId || `conv_${Date.now()}`,
      ...(usage && { usage }),
      ...(analyticsResponse.chartData && { chartData: analyticsResponse.chartData }),
      ...(analyticsResponse.tableData && { tableData: analyticsResponse.tableData }),
      ...(analyticsResponse.kpis && { kpis: analyticsResponse.kpis }),
    };

    return NextResponse.json(chatResponse);
  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json(
      {
        error: 'Failed to process chat request',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  // TODO: Implement chat history retrieval
  return NextResponse.json({ messages: [] });
}
