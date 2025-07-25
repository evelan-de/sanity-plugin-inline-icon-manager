import { StateCreator } from 'zustand'

export interface AISuggestion {
  iconName: string
  setPrefix: string // Technical provider code (e.g., 'lucide', 'heroicons', 'mdi')
  iconProviderDisplayName: string // Human-readable provider name (e.g., 'Lucide', 'Heroicons', 'Material Design Icons')
  name: string // Icon name/identifier (without prefix)
  reasoning: string
  confidence?: number
}

// Adjust accordingly if you want to add more models, for now these models offer the Object Generation API
// Reference: https://ai-sdk.dev/docs/foundations/providers-and-models#model-capabilities
export type AIModel =
  | 'gpt-4.1'
  | 'gpt-4.1-mini'
  | 'gpt-4.1-nano'
  | 'gpt-4o'
  | 'gpt-4o-mini'
  | 'o1'
  | 'o3'
  | 'o3-mini'
  | 'o4-mini'

export const AI_MODELS: { value: AIModel; label: string }[] = [
  { value: 'gpt-4.1', label: 'GPT-4.1' },
  { value: 'gpt-4.1-mini', label: 'GPT-4.1 Mini' },
  { value: 'gpt-4.1-nano', label: 'GPT-4.1 Nano' },
  { value: 'gpt-4o', label: 'GPT-4o' },
  { value: 'gpt-4o-mini', label: 'GPT-4o Mini' },
  { value: 'o1', label: 'o1' },
  { value: 'o3', label: 'o3' },
  { value: 'o3-mini', label: 'o3-mini' },
  { value: 'o4-mini', label: 'o4-mini' },
]

export interface AISlice {
  // State
  aiPrompt: string
  aiSuggestions: AISuggestion[]
  isAILoading: boolean
  aiError: string | null
  isStreaming: boolean
  selectedModel: AIModel

  // Actions
  setAIPrompt: (prompt: string) => void
  setAISuggestions: (suggestions: AISuggestion[]) => void
  setAILoading: (loading: boolean) => void
  setAIError: (error: string | null) => void
  setStreaming: (streaming: boolean) => void
  setSelectedModel: (model: AIModel) => void
  clearAISuggestions: () => void
  resetAIState: () => void
}

const initialAIState = {
  aiPrompt: '',
  aiSuggestions: [],
  isAILoading: false,
  aiError: null,
  isStreaming: false,
  selectedModel: 'gpt-4.1-mini' as AIModel,
}

export const createAISlice: StateCreator<AISlice> = (set) => ({
  ...initialAIState,

  setAIPrompt: (prompt: string) => set({ aiPrompt: prompt }),

  setAISuggestions: (suggestions: AISuggestion[]) => set({ aiSuggestions: suggestions }),

  setAILoading: (loading: boolean) =>
    set({ isAILoading: loading, aiError: loading ? null : undefined }),

  setAIError: (error: string | null) =>
    set({ aiError: error, isAILoading: false, isStreaming: false }),

  setStreaming: (streaming: boolean) => set({ isStreaming: streaming }),

  setSelectedModel: (model: AIModel) => set({ selectedModel: model }),

  clearAISuggestions: () => set({ aiSuggestions: [], aiError: null }),

  resetAIState: () => set(initialAIState),
})
