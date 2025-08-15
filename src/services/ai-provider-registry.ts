/**
 * @file ai-provider-registry.ts
 *
 * Provider registry for managing AI provider instances and caching.
 * Handles runtime provider registration, model instantiation, and lifecycle management.
 */

import { LanguageModel } from 'ai'

import {
  AILanguageEngineType,
  AIProviderRegistry,
  BaseProviderType,
  FlexibleAIProvider,
  ProviderCacheKey,
} from '../types/ai-config'

/**
 * Implementation of the AI provider registry
 * Manages provider instances with caching for performance
 */
class AIProviderRegistryImpl implements AIProviderRegistry {
  private providers: Map<string, FlexibleAIProvider> = new Map()
  private providerCache: Map<ProviderCacheKey, BaseProviderType> = new Map()

  /**
   * Register a provider configuration
   */
  registerProvider(provider: FlexibleAIProvider): void {
    if (!this.validateProvider(provider)) {
      throw new Error(`Invalid provider configuration: ${provider.name}`)
    }

    this.providers.set(provider.keyName, provider)
  }

  /**
   * Register multiple providers at once
   */
  registerProviders(providers: FlexibleAIProvider[]): void {
    for (const provider of providers) {
      this.registerProvider(provider)
    }
  }

  /**
   * Get all registered providers
   */
  getProviders(): FlexibleAIProvider[] {
    return Array.from(this.providers.values())
  }

  /**
   * Get provider by key name
   */
  getProvider(keyName: string): FlexibleAIProvider | undefined {
    return this.providers.get(keyName)
  }

  /**
   * Get language model instance with caching
   */
  getLanguageModel(engine: AILanguageEngineType): LanguageModel {
    const cacheKey: ProviderCacheKey = `${engine.keyName}:${engine.apiKey}`

    // Try to get cached provider instance
    let providerInstance = this.providerCache.get(cacheKey)

    if (!providerInstance) {
      // Create new provider instance
      const provider = this.getProvider(engine.keyName)

      if (!provider) {
        throw new Error(
          `Provider not found for keyName: ${engine.keyName}. ` +
            `Available providers: ${Array.from(this.providers.keys()).join(', ')}`,
        )
      }

      try {
        providerInstance = provider.createInstance(engine.apiKey)
        this.providerCache.set(cacheKey, providerInstance as BaseProviderType)
      } catch (error) {
        throw new Error(
          `Failed to create provider instance for ${provider.name}: ${
            error instanceof Error ? error.message : String(error)
          }`,
        )
      }
    }

    // Validate that the model exists in the provider
    const provider = this.getProvider(engine.keyName)
    if (!provider) {
      throw new Error(`Provider ${engine.keyName} not found`)
    }

    const modelExists = provider.models.some((model) => model.modelName === engine.model.modelName)

    if (!modelExists) {
      throw new Error(
        `Model ${engine.model.modelName} not found in provider ${provider.name}. ` +
          `Available models: ${provider.models.map((m) => m.modelName).join(', ')}`,
      )
    }

    // Type assertion is safe here because we validated the provider supports language models
    return (providerInstance as any).languageModel(engine.model.modelName)
  }

  /**
   * Clear provider cache
   */
  clearCache(): void {
    this.providerCache.clear()
  }

  /**
   * Clear cache for specific provider
   */
  clearProviderCache(keyName: string): void {
    const keysToDelete: ProviderCacheKey[] = []

    for (const cacheKey of this.providerCache.keys()) {
      if (cacheKey.startsWith(`${keyName}:`)) {
        keysToDelete.push(cacheKey)
      }
    }

    for (const key of keysToDelete) {
      this.providerCache.delete(key)
    }
  }

  /**
   * Validate provider configuration
   */
  // eslint-disable-next-line class-methods-use-this
  validateProvider(provider: FlexibleAIProvider): boolean {
    try {
      // Basic validation
      if (!provider.name || typeof provider.name !== 'string') {
        return false
      }

      if (!provider.keyName || typeof provider.keyName !== 'string') {
        return false
      }

      if (!provider.keyTitle || typeof provider.keyTitle !== 'string') {
        return false
      }

      if (!Array.isArray(provider.models) || provider.models.length === 0) {
        return false
      }

      // Validate models
      for (const model of provider.models) {
        if (!model || typeof model !== 'object') {
          return false
        }

        if (model.type !== 'language') {
          return false
        }

        if (!model.modelName || typeof model.modelName !== 'string') {
          return false
        }
      }

      if (typeof provider.createInstance !== 'function') {
        return false
      }

      return true
    } catch {
      return false
    }
  }

  /**
   * Get cache statistics for debugging
   */
  getCacheStats(): {
    providersCount: number
    cachedInstancesCount: number
    cacheKeys: string[]
  } {
    return {
      providersCount: this.providers.size,
      cachedInstancesCount: this.providerCache.size,
      cacheKeys: Array.from(this.providerCache.keys()),
    }
  }

  /**
   * Check if a provider is available and properly configured
   */
  isProviderAvailable(keyName: string, apiKey?: string): boolean {
    const provider = this.getProvider(keyName)
    if (!provider) return false

    // If API key is provided, try to create instance to validate
    if (apiKey) {
      try {
        provider.createInstance(apiKey)
        return true
      } catch {
        return false
      }
    }

    return true
  }

  /**
   * Get models for a specific provider
   */
  getProviderModels(keyName: string): string[] {
    const provider = this.getProvider(keyName)
    return provider ? provider.models.map((model) => model.modelName) : []
  }

  /**
   * Find provider that contains a specific model
   */
  findProviderForModel(modelName: string): FlexibleAIProvider | undefined {
    for (const provider of this.providers.values()) {
      if (provider.models.some((model) => model.modelName === modelName)) {
        return provider
      }
    }
    return undefined
  }
}

/**
 * Global provider registry instance
 * This singleton ensures consistent provider management across the plugin
 */
export const aiProviderRegistry = new AIProviderRegistryImpl()

/**
 * Initialize the provider registry with default providers
 * This should be called during plugin initialization
 */
export function initializeProviderRegistry(providers: FlexibleAIProvider[]): void {
  // Clear existing providers
  aiProviderRegistry.clearCache()

  // Register new providers
  aiProviderRegistry.registerProviders(providers)
}

/**
 * Get a language model instance (convenience function)
 */
export function getLanguageModel(engine: AILanguageEngineType): LanguageModel {
  return aiProviderRegistry.getLanguageModel(engine)
}

/**
 * Check if a provider is registered and available
 */
export function isProviderRegistered(keyName: string): boolean {
  return aiProviderRegistry.getProvider(keyName) !== undefined
}

/**
 * Get all registered provider names
 */
export function getRegisteredProviderNames(): string[] {
  return aiProviderRegistry.getProviders().map((provider) => provider.name)
}
