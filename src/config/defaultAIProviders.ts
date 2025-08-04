/**
 * @file defaultAIProviders.ts
 *
 * Default AI provider configurations for the plugin.
 * Provides OpenAI and DeepSeek support out of the box.
 */

import { createOpenAI } from '@ai-sdk/openai'
import { Provider } from 'ai'

import { AIProvider } from '../types/ai-config'

/**
 * Default AI provider configurations
 *
 * These providers are available by default and can be extended or overridden
 * by consuming projects through plugin configuration.
 */
export const defaultAIProviders: readonly AIProvider[] = [
  {
    name: 'OpenAI',
    keyName: 'openaiKey',
    keyTitle: 'OpenAI API Key',
    models: [
      {
        type: 'language',
        modelName: 'gpt-4o',
      },
      {
        type: 'language',
        modelName: 'gpt-4o-mini',
      },
      {
        type: 'language',
        modelName: 'gpt-4-turbo',
      },
      {
        type: 'language',
        modelName: 'gpt-4',
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
        modelName: 'gpt-4.5-preview',
      },
      {
        type: 'language',
        modelName: 'o1',
      },
      {
        type: 'language',
        modelName: 'o3-mini',
      },
      {
        type: 'language',
        modelName: 'o4-mini',
      },
    ],
    createInstance: (apiKey: string) =>
      createOpenAI({
        apiKey,
        /**
         * OpenAI compatibility mode. Should be set to `strict` when using the OpenAI API,
         * and `compatible` when using 3rd party providers.
         */
        compatibility: 'strict', // OpenAI compatibility mode
      }) as Provider,
  },
] as const satisfies readonly AIProvider[]

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
export function getDefaultProvider(keyName: string): AIProvider | undefined {
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
export function getProviderForModel(modelName: string): AIProvider | undefined {
  return defaultAIProviders.find((provider) =>
    provider.models.some((model) => model.modelName === modelName),
  )
}
