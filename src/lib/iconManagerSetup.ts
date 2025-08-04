import { addAPIProvider, disableCache, enableCache } from '@iconify/react'

import { initializeAISystem } from '../services/ai-system-initializer'
import IconManagerPluginOptions from '../types/IconManagerPluginOptions'

// Store AI system initialization result for access by components
let aiSystemResult: {
  success: boolean
  errors: string[]
  warnings: string[]
  secretsNamespace: string
  defaultModel?: { model: string; keyName: string }
} | null = null

export const getAISystemResult = () => aiSystemResult

const iconManagerSetup = (config: void | IconManagerPluginOptions): void => {
  try {
    // Setup Iconify caching and API
    disableCache('all')
    enableCache('session')

    if (config?.customEndpoint && new URL(config.customEndpoint)) {
      addAPIProvider('', {
        resources: [config.customEndpoint],
      })
    }

    // Initialize AI system if configuration is provided
    if (config?.ai) {
      aiSystemResult = initializeAISystem(config.ai)
    } else {
      // Initialize with default configuration
      aiSystemResult = initializeAISystem()
    }
  } catch (e: unknown) {
    console.error('Icon Manager Plugin', e)
  }
}

export default iconManagerSetup
