import { AIPluginConfig } from './ai-config'

export type PluginCustomColor = {
  hex: string
  title?: string
}

export type PluginCustomPalette = (string | PluginCustomColor)[]

export default interface IconManagerPluginOptions {
  /** Custom Iconify API endpoint */
  customEndpoint?: string
  /** Custom color palette for icon customization */
  customPalette?: PluginCustomPalette
  /** Whether to store SVG inline in documents */
  storeInlineSvg?: boolean
  /** Available icon collections to display */
  availableCollections?: string[]
  /** AI-powered icon suggestion configuration */
  ai?: AIPluginConfig
}
