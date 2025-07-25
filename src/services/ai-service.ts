import { createOpenAI } from '@ai-sdk/openai'
import { generateObject, streamObject } from 'ai'
import { z } from 'zod'

import { DEFAULT_API_URL } from '../lib/constants'
import { AIModel, AISuggestion } from '../store/Slices/AISlice'

// Define the schema for AI response
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
   * Generate icon suggestions based on user prompt
   */
  static async generateIconSuggestions(
    prompt: string,
    apiKey: string,
    model: AIModel = 'gpt-4o-mini',
    iconifyEndpoint: string = DEFAULT_API_URL,
  ): Promise<AISuggestion[]> {
    if (!apiKey) {
      throw new Error('OpenAI API key is required')
    }

    try {
      const openaiProvider = createOpenAI({ apiKey })
      const { object } = await generateObject({
        model: openaiProvider(model),
        schema: IconSuggestionSchema,
        prompt: AIIconService.buildPrompt(prompt),
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
    apiKey: string,
    model: AIModel = 'gpt-4.1-mini',
    iconifyEndpoint: string = DEFAULT_API_URL,
  ): AsyncGenerator<AISuggestion[], void, unknown> {
    if (!apiKey) {
      throw new Error('OpenAI API key is required')
    }

    try {
      const openaiProvider = createOpenAI({ apiKey })

      const { partialObjectStream } = streamObject({
        model: openaiProvider(model),
        schema: IconSuggestionSchema,
        prompt: AIIconService.buildPrompt(prompt),
        // temperature: 0.7, // Slightly higher temperature for more varied completions
        // maxTokens: 1024, // Ensure enough tokens for complete reasoning
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
          apiKey,
          model,
          iconifyEndpoint,
        )
        if (fallbackSuggestions.length > 0) {
          yield fallbackSuggestions
        }
      }
    } catch (error) {
      const errorMessage = AIIconService.getStreamingErrorMessage(error, model)
      throw new Error(errorMessage)
    }
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
   * Validate if an icon exists in the Iconify API
   */
  private static async validateIcon(
    setPrefix: string,
    iconName: string,
    iconifyEndpoint: string = DEFAULT_API_URL,
  ): Promise<boolean> {
    // Create a cache key
    const cacheKey = `${setPrefix}:${iconName}`

    // Check if we have a cached result
    if (cacheKey in AIIconService.iconValidationCache) {
      return AIIconService.iconValidationCache[cacheKey]
    }

    try {
      const response = await fetch(`${iconifyEndpoint}/${setPrefix}/${iconName}.svg`, {
        method: 'HEAD', // Use HEAD to check existence without downloading content
      })

      // Cache the result
      AIIconService.iconValidationCache[cacheKey] = response.ok
      return response.ok
    } catch {
      // Cache the negative result too
      AIIconService.iconValidationCache[cacheKey] = false
      return false
    }
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
      return 'Invalid OpenAI API key. Please check your OPENAI_API_KEY environment variable.'
    }

    if (error.message.includes('model')) {
      return (
        `Model '${model}' is not available or doesn't support streaming. ` +
        "Try using 'gpt-4o-mini' instead."
      )
    }

    if (error.message.includes('quota') || error.message.includes('billing')) {
      return 'OpenAI API quota exceeded. Please check your OpenAI account billing.'
    }

    return `Failed to stream icon suggestions: ${error.message}`
  }

  private static buildPrompt(userPrompt: string): string {
    return `
      <prompt>
        <purpose>
          You are an expert icon designer and UX specialist. Based on the user's prompt, suggest relevant icons from popular icon libraries from iconify. Generate the number of icons explicitly requested in the prompt, or default to 6 icons if no specific number is mentioned.
        </purpose>

        <guidance>
          Use the instructions below to generate icon suggestions that are relevant to the user's prompt.
          Consider semantic relevance, common UI/UX patterns, icon clarity, and variety in your suggestions.
          Return suggestions ordered by relevance and confidence.
          Provide complete, well-formed reasoning for each suggestion - do not truncate or abbreviate explanations.
          Use a valid and up-to-date set prefix name and icon name.
          Icon names typically follow kebab-case format (e.g., 'shopping-cart', 'user-circle', 'arrow-right').
          Avoid suggesting icons with complex or uncommon naming patterns.
          Prefer widely-used icons from popular icon sets that are more likely to exist.
        </guidance>

        <instructions>
          <instruction>Choose the most appropriate icon name that matches the user's intent</instruction>
          <instruction>Use the technical-name (e.g., 'lucide', 'heroicons', 'mdi') for setPrefix field - this must be a valid Iconify set prefix</instruction>
          <instruction>Use the display-name (e.g., 'Lucide', 'Heroicons', 'Material Design Icons') for iconProviderDisplayName field</instruction>
          <instruction>Provide the exact icon name/identifier for the 'name' field - this must be the icon name WITHOUT the prefix (e.g., 'home', 'user', 'settings')</instruction>
          <instruction>NEVER include the prefix in the 'name' field - it should be just the icon identifier</instruction>
          <instruction>Use kebab-case for multi-word icon names (e.g., 'shopping-cart', not 'shoppingCart' or 'shopping_cart')</instruction>
          <instruction>Stick to common, widely-used icons that are more likely to exist in the icon sets</instruction>
          <instruction>Avoid overly specific or complex icon names that might not exist</instruction>
          <instruction>For each icon provider, follow their typical naming conventions (e.g., 'mdi' uses 'account' not 'user')</instruction>
          <instruction>Provide a complete, 1-2 sentence reasoning for each icon explaining why it fits the prompt</instruction>
          <instruction>Ensure reasoning is complete and not cut off mid-sentence</instruction>
          <instruction>Keep reasoning concise but informative (20-40 words)</instruction>
        </instructions>

        <contexts>
          <context name="icon-providers">
            <provider>
              <technical-name>lucide</technical-name>
              <display-name>Lucide</display-name>
              <description>Simple, clean icons with descriptive names</description>
            </provider>
            <provider>
              <technical-name>heroicons</technical-name>
              <display-name>Heroicons</display-name>
              <description>Solid and outline variants, web-focused</description>
            </provider>
            <provider>
              <technical-name>tabler</technical-name>
              <display-name>Tabler Icons</display-name>
              <description>Extensive collection with consistent style</description>
            </provider>
            <provider>
              <technical-name>feather</technical-name>
              <display-name>Feather Icons</display-name>
              <description>Minimalist, stroke-based icons</description>
            </provider>
            <provider>
              <technical-name>ph</technical-name>
              <display-name>Phosphor Icons</display-name>
              <description>Versatile with multiple weights</description>
            </provider>
            <provider>
              <technical-name>mdi</technical-name>
              <display-name>Material Design Icons</display-name>
              <description>Comprehensive icon set with material design principles</description>
            </provider>
            <provider>
              <technical-name>ri</technical-name>
              <display-name>Remix Icon</display-name>
              <description>Neutral-style system symbols for interfaces</description>
            </provider>
            <provider>
              <technical-name>fa6-solid</technical-name>
              <display-name>Font Awesome 6 Solid</display-name>
              <description>Popular solid style icons from Font Awesome</description>
            </provider>
            <provider>
              <technical-name>fa6-regular</technical-name>
              <display-name>Font Awesome 6 Regular</display-name>
              <description>Popular outline style icons from Font Awesome</description>
            </provider>
            <provider>
              <technical-name>carbon</technical-name>
              <display-name>Carbon</display-name>
              <description>IBM's Carbon Design System icons</description>
            </provider>
            <provider>
              <technical-name>ion</technical-name>
              <display-name>Ionicons</display-name>
              <description>Beautifully crafted icons for web, iOS, and Android apps</description>
            </provider>
            <provider>
              <technical-name>bi</technical-name>
              <display-name>Bootstrap Icons</display-name>
              <description>Free, high quality icons from the Bootstrap team</description>
            </provider>
            <provider>
              <technical-name>fluent</technical-name>
              <display-name>Fluent UI Icons</display-name>
              <description>Microsoft's Fluent Design System icons</description>
            </provider>
          </context>
        </contexts>

        <focus-areas>
          <area>Semantic relevance to the user's prompt</area>
          <area>Common UI/UX patterns and conventions</area>
          <area>Icon clarity and recognizability</area>
          <area>Variety in suggestions while maintaining relevance</area>
          <area>Complete, well-formed reasoning explanations</area>
        </focus-areas>

        <sample-output>
          {
            "suggestions": [
              {
                "iconName": "Home",
                "setPrefix": "mdi",
                "iconProviderDisplayName": "Material Design Icons",
                "name": "home",
                "reasoning": "The home icon universally represents a main page or dashboard in web applications. It's instantly recognizable to users and follows standard navigation conventions."
              },
              {
                "iconName": "Shopping Cart",
                "setPrefix": "lucide",
                "iconProviderDisplayName": "Lucide",
                "name": "shopping-cart",
                "reasoning": "This icon clearly communicates e-commerce functionality. It's perfect for representing a cart or checkout process that users will immediately understand."
              }
            ]
          }
        </sample-output>

        <user-prompt><![CDATA[${userPrompt}]]></user-prompt>
      </prompt>
    `
  }
}

// Export class for static usage
export const aiIconService = AIIconService
