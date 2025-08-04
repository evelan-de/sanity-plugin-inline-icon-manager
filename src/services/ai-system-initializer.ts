/* eslint-disable @typescript-eslint/no-require-imports */
/* eslint-disable no-console */
/**
 * @file ai-system-initializer.ts
 *
 * AI system initializer that sets up the extensible provider system
 * based on plugin configuration and provides backward compatibility.
 */

import { DEFAULT_AI_SECRETS_NAMESPACE, defaultAIProviders } from '../config/defaultAIProviders'
import { AIPluginConfig } from '../types/ai-config'
import { AIInlineIconManagerConfig } from '../types/ai-plugin-config'
import { resolveAIConfig } from './ai-config-resolver'
import { aiProviderRegistry, initializeProviderRegistry } from './ai-provider-registry'

/**
 * Initialize the AI system with plugin configuration
 * This should be called during plugin initialization
 */
export function initializeAISystem(configOrAI?: AIInlineIconManagerConfig | AIPluginConfig): {
  success: boolean
  errors: string[]
  warnings: string[]
  secretsNamespace: string
  defaultModel?: { model: string; keyName: string }
} {
  try {
    // Convert AIPluginConfig to AIInlineIconManagerConfig if needed
    let pluginConfig: AIInlineIconManagerConfig | undefined

    if (!configOrAI) {
      pluginConfig = undefined
    } else if ('ai' in configOrAI) {
      // Already AIInlineIconManagerConfig
      pluginConfig = configOrAI as AIInlineIconManagerConfig
    } else {
      // Convert AIPluginConfig to AIInlineIconManagerConfig
      pluginConfig = { ai: configOrAI as AIPluginConfig }
    }

    // Resolve configuration (merge custom with defaults)
    const resolvedConfig = resolveAIConfig(pluginConfig)

    // Log configuration issues
    if (resolvedConfig.errors.length > 0) {
      console.error('AI Configuration Errors:', resolvedConfig.errors)
    }

    // Initialize provider registry with resolved providers
    initializeProviderRegistry(resolvedConfig.providers)

    return {
      success: resolvedConfig.errors.length === 0,
      errors: resolvedConfig.errors,
      warnings: resolvedConfig.warnings,
      secretsNamespace: resolvedConfig.secretsNamespace,
      defaultModel: resolvedConfig.defaultModel,
    }
  } catch (error) {
    const errorMessage = `Failed to initialize AI system: ${
      error instanceof Error ? error.message : String(error)
    }`

    console.error(errorMessage)

    // Fallback to default configuration
    try {
      initializeProviderRegistry([...defaultAIProviders])

      return {
        success: false,
        errors: [errorMessage, 'Using fallback default configuration'],
        warnings: [],
        secretsNamespace: 'ai-icon-suggestions',
        defaultModel: defaultAIProviders[0]?.models[0]
          ? {
              model: defaultAIProviders[0].models[0].modelName,
              keyName: defaultAIProviders[0].keyName,
            }
          : undefined,
      }
    } catch (fallbackError) {
      const fallbackErrorMessage = `Critical: Failed to initialize even default providers: ${
        fallbackError instanceof Error ? fallbackError.message : String(fallbackError)
      }`

      console.error(fallbackErrorMessage)

      return {
        success: false,
        errors: [errorMessage, fallbackErrorMessage],
        warnings: [],
        secretsNamespace: DEFAULT_AI_SECRETS_NAMESPACE,
        defaultModel: undefined,
      }
    }
  }
}

/**
 * Get current AI system status
 */
export function getAISystemStatus(): {
  isInitialized: boolean
  providersCount: number
  providerNames: string[]
  cacheStats: {
    providersCount: number
    cachedInstancesCount: number
    cacheKeys: string[]
  }
} {
  try {
    const providers = aiProviderRegistry.getProviders()
    const cacheStats = aiProviderRegistry.getCacheStats()

    return {
      isInitialized: providers.length > 0,
      providersCount: providers.length,
      providerNames: providers.map((p: any) => p.name),
      cacheStats,
    }
  } catch (error) {
    console.error('Failed to get AI system status:', error)
    return {
      isInitialized: false,
      providersCount: 0,
      providerNames: [],
      cacheStats: {
        providersCount: 0,
        cachedInstancesCount: 0,
        cacheKeys: [],
      },
    }
  }
}

/**
 * Reset AI system (useful for testing or reconfiguration)
 */
export function resetAISystem(): void {
  try {
    aiProviderRegistry.clearCache()
    console.log('AI system reset successfully')
  } catch (error) {
    console.error('Failed to reset AI system:', error)
  }
}
