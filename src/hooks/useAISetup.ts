/**
 * @file useAISetup.ts
 *
 * AI setup hook that propagates AI configuration from plugin options
 * to the application state, similar to useInputSetup for icon functionality.
 * This ensures the AI secrets namespace and other AI config is properly
 * available throughout the AI components.
 */

import { useEffect } from 'react'

import { DEFAULT_AI_SECRETS_NAMESPACE } from '../config/defaultAIProviders'
import { getAISystemResult } from '../lib/iconManagerSetup'
import { useAppStoreContext } from '../store/context'
import IconManagerPluginOptions from '../types/IconManagerPluginOptions'

/**
 * Hook to setup AI configuration from plugin options
 * This accesses the already-initialized AI system (from iconManagerSetup)
 * and propagates the namespace to component state
 */
const useAISetup = (pluginOptions: void | IconManagerPluginOptions): void => {
  const setAISecretsNamespace = useAppStoreContext((s) => s.setAISecretsNamespace)
  const setSelectedModel = useAppStoreContext((s) => s.setSelectedModel)
  const setHasCustomSecretsNamespace = useAppStoreContext((s) => s.setHasCustomSecretsNamespace)

  useEffect(() => {
    // Get the AI system initialization result
    const aiSystemResult = getAISystemResult()

    // Set the namespace from AI system result or plugin options
    const namespace =
      aiSystemResult?.secretsNamespace ||
      pluginOptions?.ai?.secretsNamespace ||
      DEFAULT_AI_SECRETS_NAMESPACE
    setAISecretsNamespace(namespace)

    if (pluginOptions?.ai?.secretsNamespace) {
      setHasCustomSecretsNamespace(true)
    }

    // Set the default model from AI system result if available
    if (aiSystemResult?.defaultModel) {
      setSelectedModel(aiSystemResult.defaultModel.model)
    }
  }, [
    pluginOptions?.ai?.secretsNamespace,
    setAISecretsNamespace,
    setSelectedModel,
    setHasCustomSecretsNamespace,
  ])
}

export default useAISetup
