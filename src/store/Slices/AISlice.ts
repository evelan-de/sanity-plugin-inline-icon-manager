import { StateCreator } from 'zustand'

export interface AISuggestion {
  iconName: string
  setPrefix: string // Technical provider code (e.g., 'lucide', 'heroicons', 'mdi')
  iconProviderDisplayName: string // Human-readable provider name (e.g., 'Lucide', 'Heroicons', 'Material Design Icons')
  name: string // Icon name/identifier (without prefix)
  reasoning: string
  confidence?: number
}

export interface AISlice {
  // State
  aiPrompt: string
  aiSuggestions: AISuggestion[]
  isAILoading: boolean
  aiError: string | null
  isStreaming: boolean
  selectedModel: string
  aiSecretsNamespace: string | null
  hasCustomSecretsNamespace: boolean

  // Actions
  setAIPrompt: (prompt: string) => void
  setAISuggestions: (suggestions: AISuggestion[]) => void
  setAILoading: (loading: boolean) => void
  setAIError: (error: string | null) => void
  setStreaming: (streaming: boolean) => void
  setSelectedModel: (model: string) => void
  setAISecretsNamespace: (namespace: string) => void
  setHasCustomSecretsNamespace: (hasCustomSecretsNamespace: boolean) => void
  clearAISuggestions: () => void
  resetAIState: () => void
}

const initialAIState = {
  aiPrompt: '',
  aiSuggestions: [],
  isAILoading: false,
  aiError: null,
  isStreaming: false,
  selectedModel: 'gpt-4.1-mini',
  aiSecretsNamespace: null,
  hasCustomSecretsNamespace: false,
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

  setSelectedModel: (model: string) => set({ selectedModel: model }),
  setAISecretsNamespace: (namespace: string) => set({ aiSecretsNamespace: namespace }),
  setHasCustomSecretsNamespace: (hasCustomSecretsNamespace: boolean) =>
    set({ hasCustomSecretsNamespace }),
  clearAISuggestions: () => set({ aiSuggestions: [] }),
  resetAIState: () => set(initialAIState),
})
