/**
 * @file ai-service.ts
 *
 * AI service that uses the extensible provider system.
 * Supports multiple AI providers and models through the provider registry.
 */

import { generateObject, streamObject } from 'ai'
import { z } from 'zod'

import { DEFAULT_API_URL } from '../lib/constants'
import { AISuggestion } from '../store/Slices/AISlice'
import { AILanguageEngineType } from '../types/ai-config'
import { getLanguageModel } from './ai-provider-registry'

// Define the schema for AI response (same as original)
const IconSuggestionSchema = z.object({
  suggestions: z.array(
    z.object({
      iconName: z.string().describe('The descriptive name of the suggested icon'),
      setPrefix: z
        .string()
        .describe('The technical icon provider code (e.g., lucide, heroicons, tabler, mdi, etc.)'),
      iconProviderDisplayName: z
        .string()
        .describe(
          'The human-readable icon provider name (e.g., Lucide, Heroicons, Tabler Icons, Material Design Icons, etc.)',
        ),
      name: z
        .string()
        .describe('The exact icon name/identifier used by the provider (without prefix)'),
      reasoning: z.string().describe('Brief explanation of why this icon fits the prompt'),
    }),
  ),
})

export class AIIconService {
  // Cache for validated icons to avoid redundant API calls
  private static iconValidationCache: Record<string, boolean> = {}

  /**
   * Generate icon suggestions using the extensible provider system
   */
  static async generateIconSuggestions(
    prompt: string,
    engine: AILanguageEngineType,
    iconifyEndpoint: string = DEFAULT_API_URL,
    locale: string = 'en-US',
  ): Promise<AISuggestion[]> {
    try {
      const model = getLanguageModel(engine)

      const { object } = await generateObject({
        model,
        schema: IconSuggestionSchema,
        prompt: AIIconService.buildPrompt(prompt, locale),
      })

      // Validate all suggestions before returning
      const validationPromises = object.suggestions.map(async (suggestion) => {
        const iconExists = await AIIconService.validateIcon(
          suggestion.setPrefix,
          suggestion.name,
          iconifyEndpoint,
        )

        return iconExists ? suggestion : null
      })

      const validationResults = await Promise.all(validationPromises)
      return validationResults.filter(
        (suggestion): suggestion is AISuggestion => suggestion !== null,
      )
    } catch (error) {
      console.error('Error generating icon suggestions:', error)
      throw error
    }
  }

  /**
   * Generate icon suggestions with true streaming using streamObject
   */
  static async *streamIconSuggestions(
    prompt: string,
    engine: AILanguageEngineType,
    iconifyEndpoint: string = DEFAULT_API_URL,
    locale: string = 'en-US',
  ): AsyncGenerator<AISuggestion[], void, unknown> {
    try {
      const model = getLanguageModel(engine)

      const { partialObjectStream } = streamObject({
        model,
        schema: IconSuggestionSchema,
        prompt: AIIconService.buildPrompt(prompt, locale),
      })

      let previousCount = 0
      const yieldedSuggestions = new Set<string>()
      const pendingSuggestions: Map<string, Partial<AISuggestion>> = new Map()
      let lastYieldTime = Date.now()
      const yieldDelay = 500 // ms between yields to allow for more complete suggestions

      for await (const partialObject of partialObjectStream) {
        const suggestions = AIIconService.extractValidSuggestions(partialObject)

        // Skip if no new suggestions
        if (suggestions.length <= previousCount) continue

        const newSuggestions = suggestions.slice(previousCount)

        // Update our pending suggestions map with new/updated suggestions
        for (const suggestion of newSuggestions) {
          const key =
            suggestion.setPrefix && suggestion.name
              ? `${suggestion.setPrefix}:${suggestion.name}`
              : `temp:${Math.random()}`

          // Skip already yielded suggestions
          if (yieldedSuggestions.has(key)) continue

          // Update or add to pending suggestions
          pendingSuggestions.set(key, {
            ...pendingSuggestions.get(key),
            ...suggestion,
          })
        }

        // Check for suggestions with complete reasoning
        const readySuggestions: AISuggestion[] = []

        // Validate icons in parallel and filter complete suggestions
        const validationPromises = Array.from(pendingSuggestions.entries()).map(
          async ([key, suggestion]) => {
            // Check if suggestion is complete and reasoning looks complete
            const isComplete = Boolean(
              suggestion.iconName &&
                suggestion.setPrefix &&
                suggestion.name &&
                suggestion.reasoning &&
                suggestion.iconProviderDisplayName,
            )

            // Check if reasoning appears to be a complete sentence
            const hasCompleteReasoning = AIIconService.isReasoningComplete(
              suggestion.reasoning || '',
            )

            // Validate icon exists in Iconify API
            let iconExists = false

            if (isComplete) {
              iconExists = await AIIconService.validateIcon(
                suggestion.setPrefix!,
                suggestion.name!,
                iconifyEndpoint,
              )
            }

            return {
              key,
              suggestion,
              isValid: isComplete && hasCompleteReasoning && iconExists,
            }
          },
        )

        const validationResults = await Promise.all(validationPromises)

        validationResults.forEach(({ key, suggestion, isValid }) => {
          if (isValid && !yieldedSuggestions.has(key)) {
            readySuggestions.push(suggestion as AISuggestion)
            yieldedSuggestions.add(key)
          }
        })

        // Only yield if we have ready suggestions and enough time has passed
        const now = Date.now()
        if (readySuggestions.length > 0 && now - lastYieldTime > yieldDelay) {
          yield readySuggestions
          lastYieldTime = now
          previousCount = suggestions.length
        }
      }

      // Final check for any remaining suggestions that might be complete enough
      const finalValidationPromises = Array.from(pendingSuggestions.entries())
        .filter(([key]) => !yieldedSuggestions.has(key))
        .map(async ([key, suggestion]) => {
          // Less strict check for final batch
          const isBasicallyComplete = Boolean(
            suggestion.iconName && suggestion.setPrefix && suggestion.name && suggestion.reasoning,
          )

          // Still validate icon exists
          const iconExists = isBasicallyComplete
            ? await AIIconService.validateIcon(
                suggestion.setPrefix!,
                suggestion.name!,
                iconifyEndpoint,
              )
            : false

          return {
            key,
            suggestion,
            isValid: isBasicallyComplete && iconExists,
          }
        })

      const finalValidationResults = await Promise.all(finalValidationPromises)
      const finalSuggestions: AISuggestion[] = []

      finalValidationResults.forEach(({ key, suggestion, isValid }) => {
        if (isValid) {
          finalSuggestions.push(suggestion as AISuggestion)
          yieldedSuggestions.add(key)
        }
      })

      if (finalSuggestions.length > 0) {
        yield finalSuggestions
      }

      // Fallback to non-streaming if no results from streaming
      if (yieldedSuggestions.size === 0) {
        const fallbackSuggestions = await AIIconService.generateIconSuggestions(
          prompt,
          engine,
          iconifyEndpoint,
          locale,
        )
        if (fallbackSuggestions.length > 0) {
          yield fallbackSuggestions
        }
      }
    } catch (error) {
      const errorMessage = AIIconService.getStreamingErrorMessage(error, engine.model.toString())
      throw new Error(errorMessage)
    }
  }

  /**
   * Build the AI prompt for icon suggestions
   */
  static buildPrompt(userPrompt: string, locale: string = 'en-US'): string {
    return `
      <purpose>
        You are an AI assistant specialized in suggesting relevant icons based on user descriptions. Your goal is to provide accurate, contextually appropriate icon suggestions from popular icon libraries.
      </purpose>

      <guidance>
        - Focus on finding icons that best match the user's intent and context
        - Prioritize commonly used and well-designed icons
        - Consider both literal and metaphorical representations
        - Ensure icon names are accurate and exist in the specified libraries
      </guidance>

      <instructions>
        For each icon suggestion, provide:
        1. A clear, descriptive name for the icon
        2. The correct technical provider code (setPrefix)
        3. The human-readable provider name
        4. The exact icon identifier used by the provider
        5. A brief explanation of why this icon fits the request

        IMPORTANT: Write the reasoning explanation (field #5) in the following language: ${locale}
        All other fields should remain in English regardless of the locale.
      </instructions>

      <contexts>
        Popular icon providers and their prefixes:
        - Lucide (lucide): Modern, clean line icons
        - Heroicons (heroicons): Tailwind CSS icons, outline and solid variants
        - Tabler Icons (tabler): Free SVG icons with consistent style
        - Material Design Icons (mdi): Google's material design icon set
        - Feather Icons (feather): Simply beautiful open source icons
        - Font Awesome (fa): Comprehensive icon library
        - Bootstrap Icons (bi): Official Bootstrap icon library
        - Phosphor Icons (ph): Flexible icon family
        - Remix Icons (ri): Neutral-style system symbols
      </contexts>

      <focus-areas>
        - Accuracy: Ensure all suggested icons actually exist
        - Relevance: Match the user's specific needs and context
        - Variety: Provide options from different providers when appropriate
        - Quality: Prioritize well-designed, popular icons
        - Localization: The reasoning explanation MUST be written in ${locale} language
      </focus-areas>

      <user-prompt>
        <![CDATA[${userPrompt}]]>
      </user-prompt>

      Generate relevant icon suggestions based on the user's request. The number of suggestions should match what the user explicitly requests, or default to 6 suggestions if no specific number is mentioned. Remember to write the reasoning field in ${locale} language.
    `
  }

  /**
   * Extract valid suggestions from partial object
   */
  private static extractValidSuggestions(partialObject: unknown): Partial<AISuggestion>[] {
    if (!partialObject || typeof partialObject !== 'object') {
      return []
    }

    const obj = partialObject as { suggestions?: unknown }
    if (!obj.suggestions || !Array.isArray(obj.suggestions)) {
      return []
    }

    return obj.suggestions.filter(
      (suggestion): suggestion is Partial<AISuggestion> =>
        suggestion !== undefined && suggestion !== null && typeof suggestion === 'object',
    )
  }

  /**
   * Check if reasoning text appears to be complete
   * This helps filter out partial or truncated reasoning during streaming
   */
  private static isReasoningComplete(reasoning: string): boolean {
    if (!reasoning || reasoning.length < 10) {
      return false
    }

    // Check if reasoning ends with proper punctuation
    const endsWithPunctuation = /[.!?]\s*$/.test(reasoning)

    // Check if reasoning has a minimum length and doesn't appear cut off
    const hasMinimumLength = reasoning.length >= 20

    // Check if reasoning doesn't end with partial words or conjunctions
    const doesntEndWithPartialWord =
      !/(^|\s)(and|or|but|because|which|that|with|by|as|for|to|in|on|at|of|th|wh|an)$/i.test(
        reasoning,
      )

    return endsWithPunctuation && hasMinimumLength && doesntEndWithPartialWord
  }

  /**
   * Get appropriate error message for streaming failures
   */
  private static getStreamingErrorMessage(error: unknown, model: string): string {
    if (!(error instanceof Error)) {
      return 'Failed to stream icon suggestions: Unknown error'
    }

    if (error.message.includes('API key')) {
      return 'Invalid API key. Please check your AI provider API key configuration.'
    }

    if (error.message.includes('model')) {
      return (
        `Model '${model}' is not available or doesn't support streaming. ` +
        'Try using a different model.'
      )
    }

    if (error.message.includes('quota') || error.message.includes('billing')) {
      return 'API quota exceeded. Please check your AI provider account billing.'
    }

    return `Failed to stream icon suggestions: ${error.message}`
  }

  /**
   * Validate if an icon exists using Iconify API
   */
  static async validateIcon(
    setPrefix: string,
    iconName: string,
    iconifyEndpoint: string = DEFAULT_API_URL,
  ): Promise<boolean> {
    const cacheKey = `${setPrefix}:${iconName}`

    // Check cache first
    if (cacheKey in AIIconService.iconValidationCache) {
      return AIIconService.iconValidationCache[cacheKey]
    }

    try {
      const response = await fetch(`${iconifyEndpoint}/${setPrefix}/${iconName}.svg`, {
        method: 'HEAD',
      })

      const exists = response.ok
      AIIconService.iconValidationCache[cacheKey] = exists
      return exists
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      AIIconService.iconValidationCache[cacheKey] = false
      return false
    }
  }

  /**
   * Clear the icon validation cache
   */
  static clearValidationCache(): void {
    AIIconService.iconValidationCache = {}
  }

  /**
   * Get cache statistics for debugging
   */
  static getCacheStats(): {
    totalCached: number
    validIcons: number
    invalidIcons: number
  } {
    const entries = Object.entries(AIIconService.iconValidationCache)
    const validIcons = entries.filter(([, isValid]) => isValid).length
    const invalidIcons = entries.filter(([, isValid]) => !isValid).length

    return {
      totalCached: entries.length,
      validIcons,
      invalidIcons,
    }
  }
}

// Export for static usage
export const aiIconService = AIIconService
