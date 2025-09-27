// Test script to check OpenRouter API connectivity
import { OpenRouterClient } from './openrouter';

export async function testOpenRouterConnection() {
  const apiKey = process.env.OPENROUTER_API_KEY;

  if (!apiKey) {
    return { success: false, error: 'No API key found' };
  }

  try {
    const client = new OpenRouterClient(apiKey);
    const messages = [{ role: 'user' as const, content: 'Hello, can you respond with just "OK"?' }];

    const response = await client.createChatCompletion(messages);

    if ('choices' in response && response.choices.length > 0) {
      return {
        success: true,
        response: response.choices[0].message.content,
        usage: response.usage,
      };
    } else {
      return { success: false, error: 'No response from API' };
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}
