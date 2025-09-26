import { NextRequest } from 'next/server';
import { OpenRouterClient, createCartAnalysisPrompt } from '@/lib/openrouter';
import { sampleCallCenterData, getCallCenterAnalytics } from '@/lib/cart-data';

export async function POST(request: NextRequest) {
  try {
    const { message, includeCartData = true } = await request.json();

    if (!message) {
      return new Response('Message is required', { status: 400 });
    }

    const apiKey = process.env.OPENROUTER_API_KEY;
    if (!apiKey) {
      return new Response('OpenRouter API key not configured', { status: 500 });
    }

    const client = new OpenRouterClient(apiKey);

    // Prepare data for AI analysis
    const callCenterAnalytics = getCallCenterAnalytics();
    const dataContext = {
      calls: sampleCallCenterData,
      analytics: callCenterAnalytics,
    };

    const messages = includeCartData
      ? createCartAnalysisPrompt(dataContext, message)
      : [{ role: 'user' as const, content: message }];

    const openRouterStream = await client.createStreamingCompletion(messages);
    const reader = openRouterStream.getReader();
    const encoder = new TextEncoder();

    const stream = new ReadableStream({
      async start(controller) {
        try {
          while (true) {
            const { done, value } = await reader.read();

            if (done) {
              controller.enqueue(encoder.encode('data: [DONE]\n\n'));
              controller.close();
              break;
            }

            // Parse the streaming response from OpenRouter
            const chunk = new TextDecoder().decode(value);
            const lines = chunk.split('\n').filter((line) => line.trim() !== '');

            for (const line of lines) {
              if (line.startsWith('data: ')) {
                const data = line.slice(6);
                if (data === '[DONE]') {
                  controller.enqueue(encoder.encode('data: [DONE]\n\n'));
                  controller.close();
                  return;
                }

                try {
                  const parsed = JSON.parse(data);
                  if (parsed.choices && parsed.choices[0]?.delta?.content) {
                    const content = parsed.choices[0].delta.content;
                    controller.enqueue(encoder.encode(`data: ${JSON.stringify({ content })}\n\n`));
                  }
                } catch (e) {
                  // Skip invalid JSON
                  continue;
                }
              }
            }
          }
        } catch (error) {
          console.error('Streaming error:', error);
          controller.enqueue(
            encoder.encode(`data: ${JSON.stringify({ error: 'Stream error' })}\n\n`)
          );
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
      },
    });
  } catch (error) {
    console.error('Stream setup error:', error);
    return new Response('Internal server error', { status: 500 });
  }
}
