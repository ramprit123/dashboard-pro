import { NextResponse } from 'next/server';
import { getCallCenterAnalytics, generateChartAndTableData } from '@/lib/cart-data';

export async function GET() {
  try {
    // Test the local analytics without OpenRouter
    const analytics = getCallCenterAnalytics();
    const testQuery = 'Show me department breakdown';
    const response = generateChartAndTableData(testQuery, analytics);

    return NextResponse.json({
      success: true,
      analytics,
      testResponse: response,
      message: 'Local analytics working correctly',
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
