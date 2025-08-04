/**
 * @file ai-config.ts
 *
 * Core type definitions for the extensible AI provider system.
 * Based on reference implementation patterns for multi-provider AI support.
 */

import { LanguageModel, Provider } from 'ai'

/**
 * Base model type for language models used in icon suggestions
 */
export type LanguageModelType = {
  type: 'language'
  modelName: string
}

/**
 * AI Provider configuration interface
 * Defines how external projects can register custom AI providers
 */
export type AIProvider = {
  /** Display name for the provider (e.g., "OpenAI", "DeepSeek") */
  name: string
  /** Secret key name for API key storage (e.g., "openaiKey", "deepseekKey") */
  keyName: string
  /** Human-readable title for settings UI (e.g., "OpenAI API Key") */
  keyTitle: string
  /** Available models for this provider */
  models: LanguageModelType[]
  /** Function to create provider instance with API key */
  createInstance: (apiKey: string) => Provider
}

/**
 * Runtime type definitions derived from provider configurations
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
  providers?: AIProvider[]

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
  registerProvider(provider: AIProvider): void

  /** Get all registered providers */
  getProviders(): AIProvider[]

  /** Get provider by key name */
  getProvider(keyName: string): AIProvider | undefined

  /** Get language model instance */
  getLanguageModel(engine: AILanguageEngineType): LanguageModel

  /** Clear provider cache */
  clearCache(): void

  /** Validate provider configuration */
  validateProvider(provider: AIProvider): boolean
}
