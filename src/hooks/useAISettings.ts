/**
 * @file useAISettings.ts
 *
 * Advanced AI settings hook based on reference useAISettings implementation.
 * Handles provider/model resolution, API key management, and type-safe engine configuration.
 */

import { useMemo } from 'react'

import { aiProviderRegistry } from '../services/ai-provider-registry'
import { AILanguageEngineType, AIModelChoiceType } from '../types/ai-config'
import { useAISecrets } from './useAISecrets'

/**
 * AI settings discriminated union for type safety
 * Following the reference implementation pattern
 */
type AISettingsType =
  | {
      engine: AILanguageEngineType
      error: false
      loading: boolean
      secrets: unknown
    }
  | {
      engine: undefined
      error: true
      loading: boolean
      secrets: unknown
    }

/**
 * Enhanced AI settings hook following reference useAISettings pattern
 *
 * @param props - Configuration options
 * @param props.model - Override model choice (optional)
 * @param props.namespace - Custom secrets namespace (optional)
 * @returns Discriminated union with engine configuration or error state
 */
export function useAISettings(props?: {
  model?: AIModelChoiceType
  namespace?: string
}): AISettingsType {
  const { secrets, loading, getApiKey } = useAISecrets(props?.namespace)

  // Resolve active model from props or global configuration
  const activeModel = useMemo(() => {
    if (!loading && props?.model) {
      return props.model
    }

    return undefined
  }, [props?.model, loading])

  // Resolve API key for the active model
  const apiKey = useMemo(() => {
    if (loading || !activeModel) {
      return undefined
    }

    return getApiKey(activeModel.keyName)
  }, [loading, activeModel, getApiKey])

  // Validate that the provider and model are available
  const isValidConfiguration = useMemo(() => {
    if (loading || !activeModel || !apiKey) {
      return false
    }

    // Check if provider is registered
    const provider = aiProviderRegistry.getProvider(activeModel.keyName)
    if (!provider) {
      return false
    }

    // Check if model exists in provider
    const modelExists = provider.models.some((model) => model.modelName === activeModel.model)

    return modelExists
  }, [loading, activeModel, apiKey])

  // Return discriminated union for type safety
  if (!loading && activeModel && apiKey && isValidConfiguration) {
    return {
      engine: {
        model: {
          type: 'language',
          modelName: activeModel.model,
        },
        keyName: activeModel.keyName,
        apiKey,
      },
      error: false,
      loading,
      secrets,
    }
  }

  return {
    engine: undefined,
    error: true,
    loading,
    secrets,
  }
}

/**
 * Get available models for providers with valid API keys
 */
export function useAvailableModels(namespace?: string) {
  const { secrets, loading, hasValidApiKey } = useAISecrets(namespace)

  return useMemo(() => {
    if (loading) {
      return []
    }

    const availableModels: Array<{
      model: string
      keyName: string
      providerName: string
    }> = []

    // Get all registered providers
    const providers = aiProviderRegistry.getProviders()

    for (const provider of providers) {
      // Only include models from providers with valid API keys
      if (hasValidApiKey(provider.keyName)) {
        for (const model of provider.models) {
          availableModels.push({
            model: model.modelName,
            keyName: provider.keyName,
            providerName: provider.name,
          })
        }
      }
    }

    return availableModels
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading, secrets, hasValidApiKey])
}

/**
 * Check if AI is properly configured and ready to use
 */
export function useAIReadiness(namespace?: string): {
  isReady: boolean
  hasProviders: boolean
  hasApiKeys: boolean
  loading: boolean
} {
  const { loading, secrets } = useAISecrets(namespace)

  return useMemo(() => {
    if (loading) {
      return {
        isReady: false,
        hasProviders: false,
        hasApiKeys: false,
        loading: true,
      }
    }

    const providers = aiProviderRegistry.getProviders()
    const hasProviders = providers.length > 0

    // Check if any provider has valid API keys
    const hasApiKeys = providers.some((provider) => {
      const key = secrets?.[provider.keyName]
      return typeof key === 'string' && key.trim().length > 0
    })

    return {
      isReady: hasProviders && hasApiKeys,
      hasProviders,
      hasApiKeys,
      loading: false,
    }
  }, [loading, secrets])
}
