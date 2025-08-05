/**
 * Resource bundle definitions for Sanity Plugin Inline Icon Manager
 * Defines translation bundles for English and German locales
 */

import { defineLocaleResourceBundle } from 'sanity'

// Define the namespace for our plugin
export const PLUGIN_NAMESPACE = '@evelan-de/sanity-plugin-inline-icon-manager'

/**
 * English (US) resource bundle
 * Uses dynamic import to load translation resources on demand
 */
export const englishResourceBundle = defineLocaleResourceBundle({
  locale: 'en-US',
  namespace: PLUGIN_NAMESPACE,
  resources: () => import('./resources/en-US'),
})

/**
 * German resource bundle
 * Uses dynamic import to load translation resources on demand
 */
export const germanResourceBundle = defineLocaleResourceBundle({
  locale: 'de-DE',
  namespace: PLUGIN_NAMESPACE,
  resources: () => import('./resources/de-DE'),
})

/**
 * Array of all supported resource bundles
 * Export this array to register with the plugin
 */
export const i18nBundles = [englishResourceBundle, germanResourceBundle]

export type ResourcesKeys = keyof typeof englishResourceBundle
