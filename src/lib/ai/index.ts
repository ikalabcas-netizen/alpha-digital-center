import { ClaudeProvider } from './claude';
import { GeminiProvider } from './gemini';
import { DeepSeekProvider } from './deepseek';
import type { AIProvider, GenerateParams, GenerateResult } from './providers';

export type { AIProvider, GenerateParams, GenerateResult } from './providers';
export { CONTENT_TEMPLATES } from './providers';
export type { ProductContext, ContentTemplateKey } from './providers';

const providers: Record<string, AIProvider> = {
  claude: new ClaudeProvider(),
  gemini: new GeminiProvider(),
  deepseek: new DeepSeekProvider(),
};

export function getProvider(name: string): AIProvider {
  const provider = providers[name];
  if (!provider) {
    throw new Error(`AI provider "${name}" not found. Available: ${Object.keys(providers).join(', ')}`);
  }
  return provider;
}

export function getAllProviders(): AIProvider[] {
  return Object.values(providers);
}

// Fallback chain: try providers in order until one succeeds
export async function generateWithFallback(
  params: GenerateParams & { apiKeys: Record<string, string> },
  providerOrder: string[] = ['claude', 'gemini', 'deepseek']
): Promise<GenerateResult> {
  const errors: string[] = [];

  for (const name of providerOrder) {
    const apiKey = params.apiKeys[name];
    if (!apiKey) continue;

    try {
      const provider = getProvider(name);
      return await (provider as any).generateContent({ ...params, apiKey });
    } catch (err) {
      errors.push(`${name}: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  }

  throw new Error(`All AI providers failed:\n${errors.join('\n')}`);
}
