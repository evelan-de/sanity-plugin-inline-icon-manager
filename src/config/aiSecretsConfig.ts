/**
 * @file aiSecretsConfig.ts
 *
 * Enhanced AI secrets configuration with support for dynamic provider keys
 * and global model storage following the reference implementation pattern.
 */

import { AIModelChoiceType, AIProvider } from '../types/ai-config'

/**
 * Enhanced AI secrets interface with dynamic provider support
 */
export interface EnhancedAISecrets {
  // Dynamic provider keys (e.g., 'openaiKey', 'deepseekKey')
  [providerKey: string]: string | AIModelChoiceType | undefined
}

/**
 * Generate secret key configurations from provider definitions
 * Used for dynamic UI generation in settings dialogs
 */
export function generateSecretsKeysFromProviders(providers: AIProvider[]) {
  return providers.map((provider) => ({
    key: provider.keyName,
    title: provider.keyTitle,
    description: `Your ${provider.name} API key for AI-powered icon suggestions`,
  }))
}

/**
 * Validate secrets structure
 */
export function validateSecrets(secrets: unknown): secrets is EnhancedAISecrets {
  return typeof secrets === 'object' && secrets !== null
}

/**
 * Extract API keys from secrets for specific providers
 */
export function extractApiKeys(
  secrets: EnhancedAISecrets,
  providers: AIProvider[],
): Record<string, string> {
  const apiKeys: Record<string, string> = {}

  for (const provider of providers) {
    const key = secrets[provider.keyName]
    if (typeof key === 'string' && key.trim()) {
      apiKeys[provider.keyName] = key.trim()
    }
  }

  return apiKeys
}

/**
 * Check if secrets contain valid API keys for providers
 */
export function hasValidApiKeys(secrets: EnhancedAISecrets, providers: AIProvider[]): boolean {
  const apiKeys = extractApiKeys(secrets, providers)
  return Object.keys(apiKeys).length > 0
}
