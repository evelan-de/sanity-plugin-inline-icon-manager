/**
 * @file ai-config-resolver.ts
 *
 * Configuration resolver for merging custom provider configurations with defaults.
 * Handles validation and provides clear error messages for invalid configurations.
 */

import {
  DEFAULT_AI_SECRETS_NAMESPACE,
  defaultAIProviders,
  defaultModelChoice,
} from '../config/defaultAIProviders'
import { AIModelChoiceType, AIPluginConfig, FlexibleAIProvider } from '../types/ai-config'
import { AIInlineIconManagerConfig } from '../types/ai-plugin-config'

/**
 * Configuration resolution result
 */
export interface ResolvedAIConfig {
  /** Merged provider configurations */
  providers: FlexibleAIProvider[]
  /** Resolved secrets namespace */
  secretsNamespace: string
  /** Resolved default model choice */
  defaultModel: AIModelChoiceType
  /** Configuration validation errors (if any) */
  errors: string[]
  /** Configuration warnings (if any) */
  warnings: string[]
}

/**
 * Resolve and merge AI configuration from plugin options
 */
export function resolveAIConfig(pluginConfig?: AIInlineIconManagerConfig): ResolvedAIConfig {
  const result: ResolvedAIConfig = {
    providers: [],
    secretsNamespace: DEFAULT_AI_SECRETS_NAMESPACE,
    defaultModel: defaultModelChoice,
    errors: [],
    warnings: [],
  }

  // Extract AI configuration
  const aiConfig = pluginConfig?.ai

  // Resolve secrets namespace
  if (aiConfig?.secretsNamespace) {
    if (typeof aiConfig.secretsNamespace === 'string' && aiConfig.secretsNamespace.trim()) {
      result.secretsNamespace = aiConfig.secretsNamespace.trim()
    } else {
      result.errors.push('Invalid secretsNamespace: must be a non-empty string')
    }
  }

  // Resolve providers (merge custom with defaults)
  result.providers = resolveProviders(aiConfig, result)

  // Resolve default model
  result.defaultModel = resolveDefaultModel(aiConfig, result)

  return result
}

/**
 * Resolve provider configurations
 */
function resolveProviders(
  aiConfig: AIPluginConfig | undefined,
  result: ResolvedAIConfig,
): FlexibleAIProvider[] {
  const providers: FlexibleAIProvider[] = []
  const providerNames = new Set<string>()
  const keyNames = new Set<string>()

  // Add custom providers first (they take precedence)
  if (aiConfig?.providers && Array.isArray(aiConfig.providers)) {
    for (const provider of aiConfig.providers) {
      const validation = validateProvider(provider)

      if (validation.isValid) {
        // Check for duplicates
        if (providerNames.has(provider.name)) {
          result.warnings.push(`Duplicate provider name: ${provider.name}`)
          continue
        }

        if (keyNames.has(provider.keyName)) {
          result.errors.push(`Duplicate provider keyName: ${provider.keyName}`)
          continue
        }

        providers.push(provider)
        providerNames.add(provider.name)
        keyNames.add(provider.keyName)
      } else {
        result.errors.push(...validation.errors)
      }
    }
  }

  // Add default providers that don't conflict
  for (const defaultProvider of defaultAIProviders) {
    if (!keyNames.has(defaultProvider.keyName) && !providerNames.has(defaultProvider.name)) {
      providers.push(defaultProvider)
      providerNames.add(defaultProvider.name)
      keyNames.add(defaultProvider.keyName)
    } else {
      result.warnings.push(
        `Default provider ${defaultProvider.name} skipped due to custom provider override`,
      )
    }
  }

  // Ensure we have at least one provider
  if (providers.length === 0) {
    result.errors.push('No valid providers configured. At least one provider is required.')
  }

  return providers
}

/**
 * Resolve default model configuration
 */
function resolveDefaultModel(
  aiConfig: AIPluginConfig | undefined,
  result: ResolvedAIConfig,
): AIModelChoiceType {
  // Use custom default model if provided
  if (aiConfig?.defaultModel) {
    const customDefault = aiConfig.defaultModel

    // Validate that the model exists in configured providers
    const provider = result.providers.find((p) => p.keyName === customDefault.keyName)
    if (!provider) {
      result.errors.push(
        `Default model keyName '${customDefault.keyName}' not found in configured providers`,
      )
      return defaultModelChoice
    }

    const model = provider.models.find((m) => m.modelName === customDefault.model)
    if (!model) {
      result.errors.push(
        `Default model '${customDefault.model}' not found in provider '${provider.name}'`,
      )
      return defaultModelChoice
    }

    return customDefault
  }

  // Use default model if available in configured providers
  const defaultProvider = result.providers.find((p) => p.keyName === defaultModelChoice.keyName)
  if (defaultProvider) {
    const defaultModel = defaultProvider.models.find(
      (m) => m.modelName === defaultModelChoice.model,
    )
    if (defaultModel) {
      return defaultModelChoice
    }
  }

  // Fallback to first available model
  if (result.providers.length > 0 && result.providers[0].models.length > 0) {
    const fallbackProvider = result.providers[0]
    const fallbackModel = fallbackProvider.models[0]

    result.warnings.push(
      `Default model not available, using fallback: ${fallbackModel.modelName} from ${fallbackProvider.name}`,
    )

    return {
      model: fallbackModel.modelName,
      keyName: fallbackProvider.keyName,
    }
  }

  // This should not happen if we have providers, but handle gracefully
  result.errors.push('No valid models available in configured providers')
  return defaultModelChoice
}

/**
 * Provider validation result
 */
interface ProviderValidation {
  isValid: boolean
  errors: string[]
}

/**
 * Validate a provider configuration
 */
function validateProvider(provider: unknown): ProviderValidation {
  const errors: string[] = []

  if (!provider || typeof provider !== 'object') {
    return { isValid: false, errors: ['Provider must be an object'] }
  }

  const p = provider as any

  // Validate required fields
  if (!p.name || typeof p.name !== 'string') {
    errors.push('Provider name is required and must be a string')
  }

  if (!p.keyName || typeof p.keyName !== 'string') {
    errors.push('Provider keyName is required and must be a string')
  }

  if (!p.keyTitle || typeof p.keyTitle !== 'string') {
    errors.push('Provider keyTitle is required and must be a string')
  }

  if (!Array.isArray(p.models) || p.models.length === 0) {
    errors.push('Provider models must be a non-empty array')
  } else {
    // Validate models
    p.models.forEach((model: any, index: number) => {
      if (!model || typeof model !== 'object') {
        errors.push(`Model at index ${index} must be an object`)
        return
      }

      if (model.type !== 'language') {
        errors.push(`Model at index ${index} must have type 'language'`)
      }

      if (!model.modelName || typeof model.modelName !== 'string') {
        errors.push(`Model at index ${index} must have a modelName string`)
      }
    })
  }

  if (typeof p.createInstance !== 'function') {
    errors.push('Provider createInstance must be a function')
  }

  return {
    isValid: errors.length === 0,
    errors,
  }
}

/**
 * Get provider by key name from resolved configuration
 */
export function getProviderByKeyName(
  providers: FlexibleAIProvider[],
  keyName: string,
): FlexibleAIProvider | undefined {
  return providers.find((provider) => provider.keyName === keyName)
}

/**
 * Get all model names from resolved providers
 */
export function getAllModelNames(providers: FlexibleAIProvider[]): string[] {
  return providers.flatMap((provider) => provider.models.map((model) => model.modelName))
}

/**
 * Check if a model exists in the resolved providers
 */
export function isValidModel(
  providers: FlexibleAIProvider[],
  modelName: string,
  keyName: string,
): boolean {
  const provider = getProviderByKeyName(providers, keyName)
  if (!provider) return false

  return provider.models.some((model) => model.modelName === modelName)
}
