import { NextResponse } from 'next/server';
import { testOpenRouterConnection } from '@/lib/test-openrouter';

export async function GET() {
  try {
    const result = await testOpenRouterConnection();
    return NextResponse.json(result);
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
