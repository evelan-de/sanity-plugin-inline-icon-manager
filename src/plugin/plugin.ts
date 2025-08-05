import { definePlugin } from 'sanity'

import { i18nBundles } from '../i18n/bundles'
import iconManagerSetup from '../lib/iconManagerSetup'
import IconManagerObject from '../schemas/objects/IconManager'
import IconManagerPluginOptions from '../types/IconManagerPluginOptions'

export const IconManager = definePlugin<void | IconManagerPluginOptions>((config) => {
  iconManagerSetup(config)

  return {
    name: `sanity-plugin-icon-manager`,
    schema: {
      types: [IconManagerObject(config)],
    },
    i18n: {
      bundles: i18nBundles,
    },
  }
})
