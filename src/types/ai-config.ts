/**
 * @file ai-config.ts
 *
 * Core type definitions for the extensible AI provider system.
 * Based on reference implementation patterns for multi-provider AI support.
 * Supports dynamic provider types (OpenAI, DeepSeek, etc.) and language models only.
 */

import type { OpenAIProvider } from '@ai-sdk/openai'
import type { ProviderV2 } from '@ai-sdk/provider'
import { LanguageModel } from 'ai'

/**
 * Base model type for language models used in icon suggestions
 * Note: This plugin only supports language models, not image models
 */
export type LanguageModelType = {
  type: 'language'
  modelName: string
}

/**
 * Base provider type that all AI providers must extend
 * Uses the standard Provider interface from the '@ai-sdk/provider' package
 */
export type BaseProviderType = ProviderV2

/**
 * Default supported provider types - OpenAI only by default
 * External projects can extend this through module augmentation or custom types
 */
export type ProviderType = OpenAIProvider

/**
 * AI Provider configuration interface
 * Defines how external projects can register custom AI providers
 * Generic type parameter allows for specific provider types while maintaining safety
 */
export type AIProvider<T extends BaseProviderType = ProviderType> = {
  /** Display name for the provider (e.g., "OpenAI", "DeepSeek") */
  name: string
  /** Secret key name for API key storage (e.g., "openaiKey", "deepseekKey") */
  keyName: string
  /** Human-readable title for settings UI (e.g., "OpenAI API Key") */
  keyTitle: string
  /** Available models for this provider (language models only) */
  models: LanguageModelType[]
  /** Function to create provider instance with API key */
  createInstance: (apiKey: string) => T
}

/**
 * Flexible AIProvider type that can handle any provider extending BaseProviderType
 * This allows external projects to add custom providers while maintaining type safety
 */
export type FlexibleAIProvider = AIProvider<BaseProviderType>

/**
 * Runtime type definitions derived from provider configurations
 * These types are designed to work with const assertions for type safety
 */
export type AIModelType = LanguageModelType
export type AIModelNameType = string
export type AIProviderType = string
export type AIKeyNameType = string

/**
 * Model choice configuration for selecting specific model + provider
 */
export type AIModelChoiceType = {
  model: AIModelNameType
  keyName: AIKeyNameType
}

/**
 * AI Engine configuration with resolved provider and API key
 */
export type AILanguageEngineType = {
  model: LanguageModelType
  keyName: AIKeyNameType
  apiKey: string
}

/**
 * Plugin configuration interface for AI options
 */
export interface AIPluginConfig {
  /** Custom secret namespace (defaults to 'ai-icon-suggestions') */
  secretsNamespace?: string

  /** Custom provider configurations (optional - uses defaults if not provided) */
  providers?: FlexibleAIProvider[]

  /** Default model selection (optional - uses internal default if not provided) */
  defaultModel?: AIModelChoiceType
}

/**
 * Enhanced plugin configuration interface
 */
export interface PluginConfig {
  /** AI-specific configuration options */
  ai?: AIPluginConfig

  // Other existing plugin options can be added here
  [key: string]: unknown
}

/**
 * Provider cache key type for instance caching
 */
export type ProviderCacheKey = `${string}:${string}` // keyName:apiKey

/**
 * Provider registry interface for managing AI provider instances
 */
export interface AIProviderRegistry {
  /** Register a provider configuration */
  registerProvider(provider: FlexibleAIProvider): void

  /** Get all registered providers */
  getProviders(): FlexibleAIProvider[]

  /** Get provider by key name */
  getProvider(keyName: string): FlexibleAIProvider | undefined

  /** Get language model instance */
  getLanguageModel(engine: AILanguageEngineType): LanguageModel

  /** Clear provider cache */
  clearCache(): void

  /** Validate provider configuration */
  validateProvider(provider: FlexibleAIProvider): boolean
}
