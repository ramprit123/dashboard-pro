import { NextRequest } from 'next/server';

export async function POST(request: NextRequest) {
  const { message } = await request.json();
  
  if (!message) {
    return new Response('Message is required', { status: 400 });
  }

  const encoder = new TextEncoder();
  
  const stream = new ReadableStream({
    start(controller) {
      // Mock streaming response
      const words = `Here's a streaming response to: "${message}".`.split(' ');
      let i = 0;
      
      const interval = setInterval(() => {
        if (i < words.length) {
          const chunk = encoder.encode(`data: ${JSON.stringify({ word: words[i] })}\n\n`);
          controller.enqueue(chunk);
          i++;
        } else {
          controller.enqueue(encoder.encode('data: [DONE]\n\n'));
          controller.close();
          clearInterval(interval);
        }
      }, 100);
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    },
  });
}