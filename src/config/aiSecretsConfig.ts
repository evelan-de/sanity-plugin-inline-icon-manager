// Define the keys that users can configure
export const aiSecretsKeys = [
  {
    key: 'openaiApiKey',
    title: 'OpenAI API Key',
    description: 'Your OpenAI API key for AI-powered icon suggestions',
  },
]

// Type for our secrets structure
export interface AISecrets {
  openaiApiKey?: string
}
