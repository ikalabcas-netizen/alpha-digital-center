import Anthropic from '@anthropic-ai/sdk';
import type { AIProvider, GenerateParams, GenerateResult } from './providers';

export class ClaudeProvider implements AIProvider {
  name = 'claude';
  displayName = 'Claude (Anthropic)';
  private client: Anthropic | null = null;

  private getClient(apiKey: string): Anthropic {
    if (!this.client) {
      this.client = new Anthropic({ apiKey });
    }
    return this.client;
  }

  async generateContent(
    params: GenerateParams & { apiKey: string; model?: string }
  ): Promise<GenerateResult> {
    const client = this.getClient(params.apiKey);
    const model = params.model || 'claude-sonnet-4-6-20250514';

    const response = await client.messages.create({
      model,
      max_tokens: params.maxTokens || 2048,
      temperature: params.temperature || 0.7,
      system: params.systemPrompt || 'Bạn là chuyên gia marketing nha khoa tại Việt Nam. Viết nội dung bằng tiếng Việt chuyên nghiệp.',
      messages: [{ role: 'user', content: params.prompt }],
    });

    const textBlock = response.content.find((b) => b.type === 'text');
    const content = textBlock ? textBlock.text : '';

    // Cost estimation (approximate)
    const inputTokens = response.usage.input_tokens;
    const outputTokens = response.usage.output_tokens;
    const costUsd = (inputTokens * 0.003 + outputTokens * 0.015) / 1000;

    return {
      content,
      provider: 'claude',
      model,
      inputTokens,
      outputTokens,
      costUsd,
    };
  }
}
