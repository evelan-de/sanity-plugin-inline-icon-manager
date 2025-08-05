/**
 * Translation utility hook for the plugin
 * Provides a convenient wrapper around Sanity's useTranslation hook
 */

import { useTranslation as useSanityTranslation } from 'sanity'

import { PLUGIN_NAMESPACE } from '../i18n/bundles'

/**
 * Custom hook for plugin translations
 * Automatically uses the plugin namespace and provides type safety
 */
export function useTranslation() {
  const response = useSanityTranslation(PLUGIN_NAMESPACE)

  return {
    t: response.t,
  }
}
