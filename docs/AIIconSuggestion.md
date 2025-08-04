# AI Icon Suggestion Feature Documentation

## Overview

The AI Icon Suggestion feature is a powerful addition to the Sanity Inline Icon Manager plugin that allows users to discover and select icons based on natural language prompts. Using an extensible AI provider system (supporting OpenAI, DeepSeek, and custom providers), the feature analyzes user prompts and suggests relevant icons from various icon libraries supported by Iconify. This documentation provides a comprehensive overview of the feature's architecture, functionality, and implementation details.

## Table of Contents

1. [Architecture](#architecture)
2. [Key Components](#key-components)
3. [AI Service](#ai-service)
4. [User Interface](#user-interface)
5. [Icon Validation](#icon-validation)
6. [Configuration](#configuration)
7. [Prompt Engineering](#prompt-engineering)
8. [Usage Examples](#usage-examples)
9. [Implementation Details](#implementation-details)

## Architecture

The AI Icon Suggestion feature follows a modular architecture that integrates with the existing Sanity plugin structure:

```
src/
├── components/
│   └── TabPanelAI/
│       ├── index.tsx              # Main AI tab panel component
│       ├── AIPromptInput.tsx      # Prompt input and streaming UI
│       ├── AISuggestionCard.tsx   # Individual icon suggestion card
│       ├── AISuggestionsGrid.tsx  # Grid display for icon suggestions
│       └── AISettingsDialog.tsx   # AI provider configuration dialog
├── services/
│   ├── ai-service.ts              # Core AI service for icon suggestions
│   ├── ai-provider-registry.ts    # Extensible AI provider registry
│   ├── ai-config-resolver.ts      # Configuration resolution and validation
│   └── ai-system-initializer.ts   # AI system initialization
├── hooks/
│   ├── useAISecrets.ts            # AI secrets management hook
│   ├── useAISettings.ts           # AI settings and readiness hook
│   └── useAISetup.ts              # AI system setup hook
├── config/
│   ├── defaultAIProviders.ts      # Default AI provider configurations
│   └── aiSecretsConfig.ts         # AI secrets interface definitions
├── types/
│   ├── ai-config.ts               # AI configuration type definitions
│   └── ai-plugin-config.ts        # Plugin-specific AI configuration
└── store/
    └── Slices/
        └── AISlice.ts             # Zustand state management for AI features
```

### Data Flow

1. **Plugin Initialization**: AI system initializes with configured providers (OpenAI, DeepSeek, custom)
2. **User Input**: User enters a prompt in the AI tab and selects a model
3. **AI Processing**: The AI service uses the extensible provider system to generate suggestions
4. **Streaming Response**: Suggestions are streamed in real-time as they're generated
5. **Icon Validation**: Each suggestion is validated against the Iconify API
6. **UI Updates**: Valid suggestions are progressively displayed in the grid
7. **Selection**: User can select an icon to use in their document

## Key Components

### AISlice (State Management)

The `AISlice` is a Zustand store slice that manages the state for the AI suggestion feature:

- `prompt`: The current user prompt
- `suggestions`: Array of icon suggestions
- `isLoading`: Loading state during API calls
- `error`: Error state for failed requests
- `selectedModel`: The selected AI model for generating suggestions
- `apiKey`: The OpenAI API key (stored securely)

### TabPanelAI

The main tab panel component that integrates with the plugin's tab system. It contains:

- `AIPromptInput`: For user prompt entry and model selection
- Results grid: Displays icon suggestions in a grid layout
- Error handling: Shows appropriate messages for errors

### AIPromptInput

A specialized input component that:

- Accepts user prompts
- Provides model selection via dropdown
- Handles streaming of AI responses
- Shows loading states and progress indicators
- Provides help text and guidance

### AISuggestionCard

A card component that displays individual icon suggestions with:

- Icon preview
- Icon name and provider
- AI-generated reasoning for the suggestion
- Select button to use the icon

## AI Service

The `AIIconService` is the core service that handles communication with the OpenAI API and processes icon suggestions.

### Key Methods

#### `generateIconSuggestions`

Non-streaming method that generates icon suggestions in a single batch:

```typescript
static async generateIconSuggestions(
  prompt: string,
  apiKey: string,
  model: AIModel = 'gpt-4.1-mini',
  iconifyEndpoint: string = DEFAULT_API_URL,
): Promise<AISuggestion[]>
```

#### `streamIconSuggestions`

Streaming method that yields icon suggestions incrementally:

```typescript
static async *streamIconSuggestions(
  prompt: string,
  apiKey: string,
  model: AIModel = 'gpt-4.1-mini',
  iconifyEndpoint: string = DEFAULT_API_URL,
): AsyncGenerator<AISuggestion[], void, unknown>
```

#### `validateIcon`

Validates if an icon exists in the Iconify API:

```typescript
static async validateIcon(
  setPrefix: string,
  iconName: string,
  iconifyEndpoint: string = DEFAULT_API_URL,
): Promise<boolean>
```

#### `buildPrompt`

Builds a structured XML prompt for the AI model:

```typescript
static buildPrompt(prompt: string): string
```

### Response Schema

The AI service uses Zod schemas to validate and type the responses from the OpenAI API:

```typescript
const IconSuggestionSchema = z.object({
  suggestions: z.array(
    z.object({
      iconName: z.string(),
      setPrefix: z.string(),
      iconProviderDisplayName: z.string(),
      name: z.string(),
      reasoning: z.string(),
    }),
  ),
})
```

## User Interface

### AI Tab

The AI tab is integrated into the existing tab system of the plugin, providing a seamless experience for users. It contains:

- A prompt input field with model selection dropdown
- A grid of icon suggestions
- Loading indicators and error messages

### Streaming UI

The streaming UI provides a responsive experience by:

- Showing suggestions as they are generated
- Displaying a loading indicator during generation
- Handling errors gracefully
- Providing visual feedback on progress

### Icon Selection

Users can select icons from the suggestions by:

- Clicking the "Select Icon" button on a suggestion card
- The selected icon is then added to the document using the existing icon insertion mechanism

## Icon Validation

To ensure that only valid icons are suggested to users, the AI service implements a robust validation system:

### Validation Process

1. For each AI-generated suggestion, a HEAD request is made to the Iconify API
2. The request checks if the icon exists at `${iconifyEndpoint}/${setPrefix}/${iconName}.svg`
3. If the icon exists (HTTP 200), the suggestion is considered valid
4. If the icon doesn't exist, the suggestion is filtered out

### Validation Caching

To improve performance and reduce API calls, the service implements a simple in-memory cache:

```typescript
private static iconValidationCache: Map<string, boolean> = new Map();
```

This cache stores the results of previous validation checks, allowing the service to avoid redundant API calls for the same icons.

## Configuration

### Plugin Configuration

The AI feature can be configured through the plugin options:

```typescript
import { defineConfig } from 'sanity'
import { iconManager } from 'sanity-plugin-inline-icon-manager'

export default defineConfig({
  plugins: [
    iconManager({
      ai: {
        // Custom secrets namespace for sharing across projects
        secretsNamespace: 'my-company-ai',

        // Default model configuration
        defaultModel: {
          model: 'gpt-4o-mini',
          keyName: 'openaiKey',
        },

        // Custom providers (optional)
        providers: [
          {
            name: 'OpenAI',
            keyName: 'openaiKey',
            keyTitle: 'OpenAI API Key',
            models: [
              { modelName: 'gpt-4o-mini', displayName: 'GPT-4o Mini' },
              { modelName: 'gpt-4o', displayName: 'GPT-4o' },
            ],
          },
        ],
      },
    }),
  ],
})
```

### API Key Management

The AI provider API keys are managed securely using Sanity's studio-secrets pattern:

1. Users can configure API keys via the AI settings dialog
2. Keys are stored securely in the Sanity studio configuration
3. Keys are never exposed in client-side code or stored in plain text
4. Support for multiple providers (OpenAI, DeepSeek, custom)

### Supported Providers

The system supports multiple AI providers out of the box:

- **OpenAI**: GPT-4o, GPT-4o-mini, GPT-4-turbo, and other models
- **DeepSeek**: DeepSeek-V2.5 and other DeepSeek models
- **Custom Providers**: Extensible system for adding new AI providers

### Model Selection

Users can select from available models based on configured providers. The model selection affects:

- **Quality**: More advanced models provide better icon suggestions
- **Speed**: Smaller models respond faster
- **Cost**: Different models have different pricing structures
- **Availability**: Model availability depends on your API provider

## Prompt Engineering

The AI service uses a carefully crafted prompt structure to generate high-quality icon suggestions:

### XML Format

The prompt is structured in XML format with distinct sections:

```xml
<purpose>
  You are an AI assistant that suggests icons based on user prompts.
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
  <instruction>Use the technical-name (e.g., 'lucide', 'heroicons', 'mdi') for setPrefix field</instruction>
  <instruction>Use the display-name (e.g., 'Lucide', 'Heroicons', 'Material Design Icons') for iconProviderDisplayName field</instruction>
  <instruction>Provide the exact icon name/identifier for the 'name' field</instruction>
  <instruction>Use kebab-case for multi-word icon names (e.g., 'shopping-cart', not 'shoppingCart' or 'shopping_cart')</instruction>
  <instruction>Stick to common, widely-used icons that are more likely to exist in the icon sets</instruction>
  <instruction>Avoid overly specific or complex icon names that might not exist</instruction>
  <instruction>For each icon provider, follow their typical naming conventions</instruction>
  <instruction>Provide a complete, 1-2 sentence reasoning for each icon explaining why it fits the prompt</instruction>
</instructions>

<contexts>
  <context>
    <provider>
      <technical-name>lucide</technical-name>
      <display-name>Lucide</display-name>
      <description>Modern and consistent icon set with a friendly style</description>
    </provider>
    <!-- Additional providers... -->
  </context>
</contexts>

<focus-areas>
  <area>Semantic relevance to the user's prompt</area>
  <area>Visual clarity and recognizability</area>
  <area>Consistency with common UI patterns</area>
  <area>Variety in suggestions to give users options</area>
</focus-areas>

<user-prompt>
  <![CDATA[${prompt}]]>
</user-prompt>
```

### Icon Provider Context

The prompt includes context about various icon providers to help the AI suggest icons from different libraries:

- Lucide
- Material Design Icons (MDI)
- Tabler Icons
- Heroicons
- Phosphor Icons
- Font Awesome 6 (Solid and Regular)
- Carbon Icons
- Ionicons
- Bootstrap Icons
- Fluent UI Icons

This variety ensures users receive suggestions from a wide range of icon styles.

## Usage Examples

### Basic Usage

1. Navigate to the AI tab in the Icon Manager
2. Enter a prompt like "shopping cart for e-commerce"
3. Select a model (e.g., GPT-4o Mini)
4. Click "Generate" or press Enter
5. View and select from the suggested icons

### Advanced Prompts

Users can specify the number of icons they want:

- "Give me 10 icons related to finance and banking"
- "I need 5 weather icons for a mobile app"

The AI will generate the specified number of icons or default to 6 if not specified.

### Specific Style Requests

Users can request specific styles:

- "Minimalist icons for a clean dashboard"
- "Colorful icons for a children's app"
- "Outline-style icons for a modern website"

## Implementation Details

### Streaming Implementation

The streaming implementation uses the AI SDK's `streamObject` function to provide a true incremental streaming experience:

```typescript
const { stream } = await streamObject({
  model: openaiProvider(model),
  schema: IconSuggestionSchema,
  prompt: AIIconService.buildPrompt(prompt),
})

for await (const chunk of stream) {
  // Process each chunk of suggestions
  // Validate and yield valid suggestions
}
```

### Validation Logic

The validation logic checks if icons exist in the Iconify API:

```typescript
static async validateIcon(
  setPrefix: string,
  iconName: string,
  iconifyEndpoint: string = DEFAULT_API_URL,
): Promise<boolean> {
  // Check cache first
  const cacheKey = `${setPrefix}:${iconName}`;
  if (AIIconService.iconValidationCache.has(cacheKey)) {
    return AIIconService.iconValidationCache.get(cacheKey)!;
  }

  try {
    // Make a HEAD request to check if the icon exists
    const response = await fetch(
      `${iconifyEndpoint}/${setPrefix}/${iconName}.svg`,
      { method: 'HEAD' }
    );

    const exists = response.ok;

    // Cache the result
    AIIconService.iconValidationCache.set(cacheKey, exists);

    return exists;
  } catch (error) {
    console.error(`Error validating icon ${setPrefix}:${iconName}:`, error);
    return false;
  }
}
```

### Reasoning Completeness Check

To ensure that the AI provides complete reasoning for each suggestion, the service includes a method to check if reasoning text appears complete:

```typescript
private static isReasoningComplete(reasoning: string | undefined): boolean {
  if (!reasoning) return false;

  // Check if reasoning ends with a sentence-ending punctuation
  return /[.!?]$/.test(reasoning.trim());
}
```

## Conclusion

The AI Icon Suggestion feature enhances the Sanity Inline Icon Manager plugin by providing an intuitive way for users to discover and select icons based on natural language prompts. With robust validation, streaming UI, and carefully engineered prompts, the feature ensures that users receive high-quality, relevant, and valid icon suggestions that can be easily integrated into their Sanity documents.

For further information, refer to the source code in the `src/services/ai-service.ts` and `src/components/TabPanelAI/` directories.
