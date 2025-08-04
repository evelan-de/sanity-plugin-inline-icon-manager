/**
 * @file ai-plugin-config.ts
 *
 * AI-specific plugin configuration interfaces for the inline icon manager.
 * Defines how AI extensibility features integrate with the main plugin configuration.
 */

import { AIPluginConfig } from './ai-config'

/**
 * Complete plugin configuration interface
 * Extends existing plugin options with new AI configuration capabilities
 */
export interface AIInlineIconManagerConfig {
  /** AI-specific configuration options */
  ai?: AIPluginConfig

  /** Other existing plugin configuration options */
  [key: string]: unknown
}
