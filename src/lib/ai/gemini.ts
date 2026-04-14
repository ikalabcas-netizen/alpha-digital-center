import { GoogleGenerativeAI } from '@google/generative-ai';
import type { AIProvider, GenerateParams, GenerateResult } from './providers';

export class GeminiProvider implements AIProvider {
  name = 'gemini';
  displayName = 'Gemini (Google)';
  private client: GoogleGenerativeAI | null = null;

  private getClient(apiKey: string): GoogleGenerativeAI {
    if (!this.client) {
      this.client = new GoogleGenerativeAI(apiKey);
    }
    return this.client;
  }

  async generateContent(
    params: GenerateParams & { apiKey: string; model?: string }
  ): Promise<GenerateResult> {
    const client = this.getClient(params.apiKey);
    const modelName = params.model || 'gemini-2.0-flash';
    const model = client.getGenerativeModel({ model: modelName });

    const fullPrompt = params.systemPrompt
      ? `${params.systemPrompt}\n\n${params.prompt}`
      : params.prompt;

    const result = await model.generateContent({
      contents: [{ role: 'user', parts: [{ text: fullPrompt }] }],
      generationConfig: {
        maxOutputTokens: params.maxTokens || 2048,
        temperature: params.temperature || 0.7,
      },
    });

    const response = result.response;
    const content = response.text();
    const usage = response.usageMetadata;

    return {
      content,
      provider: 'gemini',
      model: modelName,
      inputTokens: usage?.promptTokenCount,
      outputTokens: usage?.candidatesTokenCount,
      costUsd: 0, // Gemini Flash is free tier for most usage
    };
  }
}
