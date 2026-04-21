import OpenAI from 'openai';
import type { AIProvider, GenerateParams, GenerateResult } from './providers';

export class DeepSeekProvider implements AIProvider {
  name = 'deepseek';
  displayName = 'DeepSeek';
  private client: OpenAI | null = null;

  private getClient(apiKey: string): OpenAI {
    if (!this.client) {
      this.client = new OpenAI({
        apiKey,
        baseURL: 'https://api.deepseek.com',
      });
    }
    return this.client;
  }

  async generateContent(
    params: GenerateParams & { apiKey: string; model?: string }
  ): Promise<GenerateResult> {
    const client = this.getClient(params.apiKey);
    const model = params.model || 'deepseek-chat';

    const messages: OpenAI.ChatCompletionMessageParam[] = [];
    if (params.systemPrompt) {
      messages.push({ role: 'system', content: params.systemPrompt });
    }
    messages.push({ role: 'user', content: params.prompt });

    const response = await client.chat.completions.create({
      model,
      messages,
      max_tokens: params.maxTokens || 2048,
      temperature: params.temperature || 0.7,
    });

    const content = response.choices[0]?.message?.content || '';
    const inputTokens = response.usage?.prompt_tokens;
    const outputTokens = response.usage?.completion_tokens;

    // DeepSeek pricing: ~$0.14/M input, ~$0.28/M output
    const costUsd = inputTokens && outputTokens
      ? (inputTokens * 0.00014 + outputTokens * 0.00028) / 1000
      : 0;

    return {
      content,
      provider: 'deepseek',
      model,
      inputTokens,
      outputTokens,
      costUsd,
    };
  }
}
