// OpenRouter API configuration and utilities
export interface OpenRouterMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface OpenRouterResponse {
  id: string;
  choices: Array<{
    message: {
      role: string;
      content: string;
    };
    finish_reason: string;
  }>;
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

export class OpenRouterClient {
  private apiKey: string;
  private baseUrl = 'https://openrouter.ai/api/v1';
  private lastRequestTime = 0;
  private minRequestInterval = 2000; // 2 seconds between requests for free tier

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  private async waitForRateLimit() {
    const now = Date.now();
    const timeSinceLastRequest = now - this.lastRequestTime;
    if (timeSinceLastRequest < this.minRequestInterval) {
      const waitTime = this.minRequestInterval - timeSinceLastRequest;
      console.log(`Rate limiting: waiting ${waitTime}ms`);
      await new Promise((resolve) => setTimeout(resolve, waitTime));
    }
    this.lastRequestTime = Date.now();
  }

  private async makeRequestWithRetry(
    url: string,
    options: RequestInit,
    retries = 3
  ): Promise<Response> {
    await this.waitForRateLimit();

    for (let attempt = 0; attempt < retries; attempt++) {
      try {
        const response = await fetch(url, options);

        if (response.status === 429) {
          const retryAfter = response.headers.get('retry-after');
          const waitTime = retryAfter
            ? parseInt(retryAfter) * 1000
            : Math.min(Math.pow(2, attempt) * 2000, 30000);

          console.log(
            `Rate limited (429). Waiting ${waitTime}ms before retry ${attempt + 1}/${retries}`
          );
          await new Promise((resolve) => setTimeout(resolve, waitTime));
          continue;
        }

        if (response.status === 402) {
          throw new Error(
            'OpenRouter API: Insufficient credits. Please add credits to your account.'
          );
        }

        if (response.status === 401) {
          throw new Error('OpenRouter API: Invalid API key. Please check your OPENROUTER_API_KEY.');
        }

        if (!response.ok) {
          const errorText = await response.text().catch(() => 'Unknown error');
          throw new Error(
            `OpenRouter API error: ${response.status} ${response.statusText} - ${errorText}`
          );
        }

        return response;
      } catch (error) {
        if (attempt === retries - 1) throw error;

        const waitTime = Math.min(Math.pow(2, attempt) * 1000, 10000);
        console.log(`Request failed, retrying in ${waitTime}ms...`, error);
        await new Promise((resolve) => setTimeout(resolve, waitTime));
      }
    }

    throw new Error('Max retries exceeded');
  }

  async createChatCompletion(
    messages: OpenRouterMessage[],
    model: string = 'meta-llama/llama-3.1-8b-instruct:free', // Free model with good performance
    stream: boolean = false
  ): Promise<OpenRouterResponse | ReadableStream> {
    const response = await this.makeRequestWithRetry(`${this.baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
        'X-Title': 'Chat Dashboard App',
      },
      body: JSON.stringify({
        model,
        messages,
        stream,
        temperature: 0.7,
        max_tokens: 500, // Reduced to avoid hitting limits
      }),
    });

    if (stream) {
      return response.body!;
    }

    return response.json();
  }

  async createStreamingCompletion(
    messages: OpenRouterMessage[],
    model: string = 'meta-llama/llama-3.1-8b-instruct:free'
  ): Promise<ReadableStream> {
    const response = await this.makeRequestWithRetry(`${this.baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
        'X-Title': 'Chat Dashboard App',
      },
      body: JSON.stringify({
        model,
        messages,
        stream: true,
        temperature: 0.7,
        max_tokens: 500,
      }),
    });

    return response.body!;
  }
}

export function createCartAnalysisPrompt(cartData: any, userQuestion: string): OpenRouterMessage[] {
  const systemPrompt = `You are an AI assistant specialized in analyzing e-commerce cart data. You have access to cart information including items, prices, categories, and user behavior patterns.

Your role is to:
- Analyze cart data and provide insights
- Answer questions about shopping patterns
- Suggest optimizations for cart abandonment
- Provide recommendations based on cart contents
- Help with inventory and sales analysis

Always provide clear, actionable insights based on the data provided.`;

  const cartDataString = JSON.stringify(cartData, null, 2);

  return [
    { role: 'system', content: systemPrompt },
    {
      role: 'user',
      content: `Here is the current cart data:

${cartDataString}

User question: ${userQuestion}

Please analyze this data and provide a helpful response.`,
    },
  ];
}
