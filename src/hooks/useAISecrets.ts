/**
 * @file useAISecrets.ts
 *
 * Enhanced AI secrets hook with support for custom namespaces,
 * dynamic secret structures, and global model storage.
 * Based on the AISettings.tsx reference pattern.
 */

import { useSecrets } from '@sanity/studio-secrets'
import { useMemo } from 'react'

import { EnhancedAISecrets } from '../config/aiSecretsConfig'
import { DEFAULT_AI_SECRETS_NAMESPACE } from '../config/defaultAIProviders'

/**
 * Enhanced AI secrets hook with custom namespace support
 * Follows the pattern from reference AISettings.tsx implementation
 *
 * @param namespace - Custom secrets namespace (optional)
 * @returns Enhanced secrets interface with global model management
 */
export function useAISecrets(namespace?: string) {
  const secretsNamespace = namespace || DEFAULT_AI_SECRETS_NAMESPACE
  const { secrets, loading, storeSecrets } = useSecrets<EnhancedAISecrets>(secretsNamespace)

  // Get API key for a specific provider (with legacy support)
  const getApiKey = useMemo(() => {
    return (keyName: string): string | undefined => {
      if (!secrets || loading) return undefined

      const apiKey = secrets[keyName]
      if (typeof apiKey === 'string' && apiKey.trim()) {
        return apiKey.trim()
      }
      return undefined
    }
  }, [secrets, loading])

  // Check if a provider has a valid API key
  const hasValidApiKey = useMemo(() => {
    return (keyName: string): boolean => {
      const apiKey = getApiKey(keyName)
      return Boolean(apiKey && apiKey.length > 0)
    }
  }, [getApiKey])

  // Enhanced store secrets function
  const enhancedStoreSecrets = useMemo(() => {
    return async (newSecrets: Partial<EnhancedAISecrets>) => {
      try {
        storeSecrets(newSecrets)
      } catch (error) {
        throw new Error(
          `Failed to store AI secrets: ${error instanceof Error ? error.message : String(error)}`,
        )
      }
    }
  }, [storeSecrets])

  return {
    secrets,
    loading,
    storeSecrets: enhancedStoreSecrets,
    getApiKey,
    hasValidApiKey,
    secretsNamespace,
  }
}
