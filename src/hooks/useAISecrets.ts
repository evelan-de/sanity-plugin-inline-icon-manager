import { useSecrets } from '@sanity/studio-secrets'

import { AISecrets } from '../config/aiSecretsConfig'
import { AI_SECRETS_NAMESPACE } from '../lib/constants'

/**
 * Hook to access AI secrets following the official @sanity/studio-secrets pattern
 * @returns The secrets object and loading state
 */
export function useAISecrets() {
  const { secrets, loading, storeSecrets } = useSecrets<AISecrets>(AI_SECRETS_NAMESPACE)
  return { secrets, loading, storeSecrets }
}
