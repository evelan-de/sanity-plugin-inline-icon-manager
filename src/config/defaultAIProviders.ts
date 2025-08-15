/**
 * @file defaultAIProviders.ts
 *
 * Default AI provider configurations for the plugin.
 * Provides OpenAI and DeepSeek support out of the box.
 */

import { createOpenAI } from '@ai-sdk/openai'

import { FlexibleAIProvider } from '../types/ai-config'

/**
 * Default AI provider configurations
 *
 * These providers are available by default and can be extended or overridden
 * by consuming projects through plugin configuration.
 */
export const defaultAIProviders: readonly FlexibleAIProvider[] = [
  {
    name: 'OpenAI',
    keyName: 'openaiKey',
    keyTitle: 'OpenAI API Key',
    models: [
      {
        type: 'language',
        modelName: 'gpt-5',
      },
      {
        type: 'language',
        modelName: 'gpt-5-mini',
      },
      {
        type: 'language',
        modelName: 'gpt-5-nano',
      },
      {
        type: 'language',
        modelName: 'gpt-4.1',
      },
      {
        type: 'language',
        modelName: 'gpt-4.1-mini',
      },
      {
        type: 'language',
        modelName: 'gpt-4.1-nano',
      },
      {
        type: 'language',
        modelName: 'gpt-4o',
      },
      {
        type: 'language',
        modelName: 'o1',
      },
    ],
    createInstance: (apiKey: string) =>
      createOpenAI({
        apiKey,
      }),
  },
] as const satisfies readonly FlexibleAIProvider[]

/**
 * Default model selection for icon suggestions
 * Used when no custom default model is specified in plugin configuration
 */
export const defaultModelChoice = {
  model: 'gpt-4.1-mini',
  keyName: 'openaiKey',
} as const

/**
 * Default secrets namespace
 * Used when no custom namespace is specified in plugin configuration
 */
export const DEFAULT_AI_SECRETS_NAMESPACE = 'sanity-plugin-inline-icon-manager-ai'

/**
 * Get default provider by key name
 */
export function getDefaultProvider(keyName: string): FlexibleAIProvider | undefined {
  return defaultAIProviders.find((provider) => provider.keyName === keyName)
}

/**
 * Get all available model names from default providers
 */
export function getDefaultModelNames(): string[] {
  return defaultAIProviders.flatMap((provider) => provider.models.map((model) => model.modelName))
}

/**
 * Validate if a model name exists in default providers
 */
export function isValidDefaultModel(modelName: string): boolean {
  return getDefaultModelNames().includes(modelName)
}

/**
 * Get provider that contains a specific model
 */
export function getProviderForModel(modelName: string): FlexibleAIProvider | undefined {
  return defaultAIProviders.find((provider) =>
    provider.models.some((model) => model.modelName === modelName),
  )
}
