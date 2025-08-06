# Sanity Inline Icon Manager

<p align="center">
  <img width="200" src="https://raw.githubusercontent.com/williamiommi/sanity-plugin-icon-manager/main/docs/images/SanityIconManager.png" alt="Hero"/>
</p>
<p align="center">
  <img width="50%" src="https://raw.githubusercontent.com/williamiommi/sanity-plugin-icon-manager/main/docs/images/hero.jpg" alt="Hero"/>
</p>

A Sanity plugin for selecting, managing, and customizing icons. Based on [sanity-plugin-icon-manager](https://github.com/williamiommi/sanity-plugin-icon-manager), but can be configured to use the inline svg by default for a better support for SSR.\
Powered by [Iconify](https://iconify.design/)

- [Sanity Inline Icon Manager](#sanity-inline-icon-manager)
  - [⚡️ Features](#️-features)
  - [🔌 Installation](#-installation)
  - [🧑‍💻 Usage](#-usage)
  - [❗ IMPORTANT NOTE:](#-important-note)
  - [🎬 How to render the icon on your website](#-how-to-render-the-icon-on-your-website)
  - [⚙️ Plugin Configuration](#️-plugin-configuration)
  - [👀 Document List Preview](#-document-list-preview)
  - [🧩 Add Icons to Portable Text](#-add-icons-to-portable-text)
  - [🎨 Custom Color Palette](#-custom-color-palette)
  - [🎭 Custom Diff View](#-custom-diff-view)
    - [Icon Added](#icon-added)
    - [Icon Changed](#icon-changed)
    - [Icon Removed](#icon-removed)
  - [🗂️ Collections Tab](#️-collections-tab)
  - [🤖 AI Icon Suggestions](#-ai-icon-suggestions)
    - [Key Features](#key-features)
    - [🔧 AI Extensibility \& Configuration](#-ai-extensibility--configuration)
      - [Quick Examples](#quick-examples)
    - [Documentation](#documentation)
  - [🗺️ Localization](#️-localization)
  - [🌎 Basic Hosting](#-basic-hosting)
  - [🗃️ Data model](#️-data-model)
  - [📝 License](#-license)
  - [🧪 Develop \& test](#-develop--test)
    - [Release new version](#release-new-version)

## ⚡️ Features

- Sanity v3 plugin
- Customizable icons
- SVG code stored in Sanity
- Media preview component for your entry
- Download or copy to clipboard your icon
- Presence and Change Indicator preserved
- Custom Diff View
- Provide your own color palette for monochrome icons
- Basic API Hosting
- Search filter 'Collection'
- Collections tab
- Icon Inline Renderer component
- Limit Collections option
- AI-powered icon suggestions based on natural language prompts

<br /><br />

## 🔌 Installation

```sh
npm install sanity-plugin-inline-icon-manager
```

<br /><br />

## 🧑‍💻 Usage

Add it as a plugin in `sanity.config.ts` (or .js):

```ts
import { defineConfig } from 'sanity'
import { IconManager } from 'sanity-plugin-icon-manager'

export default defineConfig({
  //...
  plugins: [
    IconManager({
      // your optional configuration here
    }),
  ],
  // ...
})
```

The plugin introduces one new object type called: `icon.manager`. You can define a new field with this type inside your documents.

```ts
import { defineField, defineType } from 'sanity'

const SampleDocument = defineType({
  type: 'document',
  name: 'sampleDocument',
  title: 'Sample Document',
  fields: [
    // ...
    defineField({
      type: 'icon.manager',
      name: 'icon',
      title: 'Icon',
    }),
    // ...
  ],
})

export default SampleDocument
```

<br /><br />

## ❗ IMPORTANT NOTE:

If you are using `Next.js` framework and are using the `IconInlineRenderer`. It's important to add this into your `next.config.js` file so to avoid the warnings and errors that isomorphic dompurify brings to have a better support for SSR pages

```ts
const webpack = require('webpack')

/** @type {import('next').NextConfig} */
const nextConfig = {
  // ... your other configurations
  webpack: (config, { isServer, nextRuntime }) => {
    // Your other code for webpack

    // !!! Add this to make the isomorphic-dompurify sanitize work with SSR !!!
    config.externals = [...config.externals, 'canvas', 'jsdom']

    return config
  },
  // ... your other configurations
}
```

<br /><br />

## 🎬 How to render the icon on your website

You can use the exported `IconInlineRenderer` component to render the icon as an inline SVG. This way it supports SSR pages as it just parses the inline SVG string and renders it.

```ts
// Let's assume that we have retrieved the following data from Sanity

{
  icon: 'bi:check2-circle',
  metadata: {
    color: {
      hex: '#6aceeb'
    },
    // ...more metadata
  }
}

------------------------------------------------------------------------------------

import { IconInlineRenderer} from "sanity-plugin-inline-icon-manager/renderer";

const MyComponent = (props) => {
  const {icon, metadata } = props

  return (
    <IconInlineRenderer
      _type="icon.manager"
      icon={icon}
      metadata={metadata}
      className="some-custom-classname"
    />
  )
}
```

<br /><br />

## ⚙️ Plugin Configuration

This is the main configuration of the plugin. The available options are:

```ts
{
  // An array of strings containing a subset of collection IDs (e.g., ['ant-design', 'material-']). This can be used when you want to limit access to only specific collections. It utilizes the 'prefixes' query parameter available on the Iconify API. More information can be found here (https://iconify.design/docs/api/collections.html).
  availableCollections?: string[]

  // This is the endpoint if you decide to host your icon sets on your own server. For more details, see the dedicated session below
  customEndpoint?: string

  // an optional array of custom color palette
  customPalette?: [
    {
      hex: string, // the hex code of your custom color
      title?: string // an optional title for you custom color used as a tooltip inside the color picker.
    },
    // other colors
  ]

  // Optional flag for storing the icons as an inline svg by default
  storeInlineSvg?: string

  // AI-powered icon suggestion configuration
  ai?: {
    // Custom secrets namespace for sharing AI configurations across projects
    secretsNamespace?: string

    // Default AI model configuration
    defaultModel?: {
      model: string      // Model name (e.g., 'gpt-4o-mini')
      keyName: string    // Provider key name (e.g., 'openaiKey')
    }

    // Custom AI providers (optional - extends default providers)
    providers?: [
      {
        name: string           // Provider display name
        keyName: string        // Secret key name for this provider
        keyTitle: string       // Display title for the API key input
        models: [
          {
            modelName: string    // Technical model name
            displayName: string  // User-friendly model name
          }
        ]
      }
    ]
  }
}
```

<br /><br />

## 👀 Document List Preview

The plugin provides a component that you can use as a [media preview](https://www.sanity.io/docs/previews-list-views) of your icon within your document list.\
You can pass a second argument (a `true` boolean value) to the function if you want to see always the original icon.

```ts
import {defineField, defineType} from 'sanity'
import {mediaPreview} from 'sanity-plugin-icon-manager'

const SampleDocument = defineType({
  type: 'document',
  name: 'sampleDocument',
  title: 'Sample Document',
  preview: {
    select: {
      // ...
      icon: 'icon'
    },
    prepare({icon, ...rest}) {
      return {
        // ...rest
        media: mediaPreview(icon)
      }
    }
  }
  fields: [
    // ...
    defineField({
      type: 'icon.manager',
      name: 'icon',
      title: 'Icon',
    }),
    // ...
  ],
})

export default SampleDocument
```

<p align="center">
  <img width="70%" src="https://raw.githubusercontent.com/williamiommi/sanity-plugin-icon-manager/main/docs/images/document-list-preview.jpg" alt="Document list preview"/>
</p>

<br /><br />

## 🧩 Add Icons to Portable Text

You can easily use the plugin inside your Portable Text, both for inline or block components. The preview will shows the rendered icon and its related name.

```ts
import { defineField, defineType } from 'sanity'

const SampleDocument = defineType({
  type: 'document',
  name: 'sampleDocument',
  title: 'Sample Document',
  fields: [
    // ...
    defineField({
      name: 'body',
      type: 'array',
      title: 'Body',
      of: [
        {
          type: 'block',
          of: [{ type: 'icon.manager', title: 'Inline Icon' }],
        },
        {
          type: 'icon.manager',
          title: 'Block Icon',
        },
      ],
    }),
    // ...
  ],
})

export default SampleDocument
```

<p align="center">
  <img width="70%" src="https://raw.githubusercontent.com/williamiommi/sanity-plugin-icon-manager/main/docs/images/portable-text-icons.jpg" alt="Portable Text Icons"/>
</p>

<br /><br />

## 🎨 Custom Color Palette

You can pass a list of custom colors to fill your monochrome icons with your brand identity.
You need to provide a list of valid hex colors (with an optional title).\
As a result, you will have access to these colors within the color picker when customizing a monochrome icon.

```ts
import { defineConfig } from 'sanity'
import { IconManager } from 'sanity-plugin-icon-manager'

export default defineConfig({
  //...
  plugins: [
    IconManager({
      customPalette: [
        {
          hex: '#AB87FF',
          title: 'Tropical Indigo',
        },
        {
          hex: '#B4E1FF',
          title: 'Uranian Blue',
        },
        {
          hex: '#F49E4C',
          title: 'Sandy brown',
        },
        {
          hex: '#2D728F',
          title: 'Cerulean',
        },
        {
          hex: '#C14953',
          title: 'Bittersweet shimmer',
        },
        {
          hex: '#AEA4BF',
          title: 'Rose quartz',
        },
        {
          hex: '#02C39A',
          title: 'Mint',
        },
      ],
    }),
  ],
  // ...
})
```

<p align="left">
  <img width="50%" src="https://raw.githubusercontent.com/williamiommi/sanity-plugin-icon-manager/main/docs/images/custom-color-palette.jpg" alt="Diff: Icon Change List"/>
</p>

<br /><br />

## 🎭 Custom Diff View

The plugin includes a [custom diff component](https://www.sanity.io/docs/custom-diff-components) that allows you to view differences in a more human-readable way.
You can have three different custom diff views:

### Icon Added

<p align="left">
  <img width="30%" src="https://raw.githubusercontent.com/williamiommi/sanity-plugin-icon-manager/main/docs/images/diff-icon-added.jpg" alt="Diff: Icon Added"/>
</p>

### Icon Changed

<p align="left">
  <img width="30%" src="https://raw.githubusercontent.com/williamiommi/sanity-plugin-icon-manager/main/docs/images/diff-icon-changed.jpg" alt="Diff: Icon Changed"/>
</p>

### Icon Removed

<p align="left">
  <img width="30%" src="https://raw.githubusercontent.com/williamiommi/sanity-plugin-icon-manager/main/docs/images/diff-icon-removed.jpg" alt="Diff: Icon Removed"/>
</p>

In any of the above cases you can always see the list of all the changes clicking on the `Show details` CTA.

<p align="left">
  <img width="50%" src="https://raw.githubusercontent.com/williamiommi/sanity-plugin-icon-manager/main/docs/images/diff-icon-change-list.jpg" alt="Diff: Icon Change List"/>
</p>

<br /><br />

## 🗂️ Collections Tab

Starting from v.1.2.0, you can browse icons through all available collections.\
The search dialog now offers a 'Tabs view' where you can choose to search for your icons as before or via the new 'Collections' tab. Here, you can scroll through all the available collections, select one, and choose an icon from the available options within the selected collection.

<p align="center">
  <img width="70%" src="https://raw.githubusercontent.com/williamiommi/sanity-plugin-icon-manager/main/docs/images/collections-tab-01.jpg" alt="Collection Tabs - Step1"/>
</p>

<p align="center">
  <img width="70%" src="https://raw.githubusercontent.com/williamiommi/sanity-plugin-icon-manager/main/docs/images/collections-tab-02.jpg" alt="Collection Tabs - Step2"/>
</p>

<br /><br />

## 🤖 AI Icon Suggestions

The plugin includes a powerful AI-powered icon suggestion feature that allows you to discover relevant icons using natural language prompts. Simply describe what you're looking for, and the AI will suggest appropriate icons from various icon libraries.

### Key Features

- **Natural language prompts** to find icons (e.g., "shopping cart for e-commerce")
- **Real-time streaming** of suggestions as they're generated
- **Automatic validation** to ensure only existing icons are suggested
- **Customizable AI model selection** with support for multiple providers
- **Detailed reasoning** for each suggested icon
- **Extensible provider system** for custom AI configurations

### 🔧 AI Extensibility & Configuration

The plugin now supports a **fully extensible AI provider system** that allows you to:

- **Use multiple AI providers** (OpenAI, DeepSeek, custom providers)
- **Share AI configurations** across projects using custom secret namespaces
- **Configure custom models** and provider-specific settings
- **Maintain backward compatibility** with existing OpenAI-only setups

#### Quick Examples

```typescript
// Default usage (no changes required)
export default defineConfig({
  plugins: [iconManager()],
})

// Custom AI configuration
export default defineConfig({
  plugins: [
    iconManager({
      ai: {
        secretsNamespace: 'my-team-ai', // Shared across projects
        providers: [
          // Add custom providers, models, etc.
        ],
      },
    }),
  ],
})
```

### Documentation

- **Basic Usage**: [AIIconSuggestion.md](./docs/AIIconSuggestion.md) - Getting started with AI suggestions
- **Advanced Configuration**: [AIExtensibilityGuide.md](./docs/AIExtensibilityGuide.md) - Complete guide to AI extensibility
- **Implementation Plan**: [AIExtensibilityPlan.md](./docs/AIExtensibilityPlan.md) - Technical implementation details

<br /><br />

## 🗺️ Localization

Levereging the [Studio UI Localization](https://www.sanity.io/docs/localizing-studio-ui) feature, starting from version 2, it is possible to localize the microcopy used by the plugin.
Here is the default English bundle:

<br />
<details>
  <summary><strong>Default bundle</strong></summary>
<br />

```js
{
  // AppStates - Empty and filled states for the icon field
  'app-states.empty-state.select-icon': 'Select icon',
  'app-states.filled-state.icon-customized': 'Icon has been customized',

  // ButtonsBoard - Tooltips for icon action buttons
  'buttons-board.tooltip.customize-icon': 'Customize Icon',
  'buttons-board.tooltip.change-icon': 'Change Icon',
  'buttons-board.tooltip.delete-icon': 'Delete Icon',

  // Dialogs
  // ConfigDialog - Icon configuration dialog
  'config-dialog.color.title': 'Color',
  'config-dialog.color.button.clear-color': 'Clear color',
  'config-dialog.color.button.title': 'Set the color to "currentColor"',
  'config-dialog.color-picker.hex': 'HEX',
  'config-dialog.color-picker.rgba': 'RGBA',
  'config-dialog.footer.button.clear': 'Clear',
  'config-dialog.footer.button.clear-configuration': 'Clear Configuration',
  'config-dialog.footer.button.save': 'Save',
  'config-dialog.footer.button.save-configuration': 'Save Configuration',
  'config-dialog.header.title': 'Configuration',
  'config-dialog.inline-svg.title': 'Inline Svg',
  'config-dialog.preview.tooltip.content':
    'Preview limited to 300x300, but your custom size is preserved.',
  'config-dialog.preview.tooltip.text': 'Preview',

  // RemoveDialog - Icon removal confirmation dialog
  'remove-dialog.button.cancel': 'Cancel',
  'remove-dialog.button.confirm': 'Confirm',
  'remove-dialog.dialog.text': 'Do you really want to remove the icon?',

  // SearchDialog - Icon search dialog
  'search-dialog.header.title': 'Find your icon',

  // Filters
  // FilterCollection - Collection filter component
  'filter-collection.title': 'Collection',
  'filter-collection.select': 'Select...',

  // FilterLimit - Limit filter component
  'filte-limit.title': 'Limit',
  'filte-limit.min-max': 'min 32 / max 999',

  // FilterPalette - Palette filter component
  'filter-palette.title': 'Palette',
  'filter-palette.select': 'Select...',

  // FilterStyle - Style filter component
  'filter-style.title': 'Style',
  'filter-style.select': 'Select...',

  // IconManagerDiffComponent
  // IconDiffChangeList - Diff view change list component
  'icon-diff-change-list.button.hide-details': 'Hide details',
  'icon-diff-change-list.button.show-details': 'Show details',

  // IconDiffWrapper - Diff view wrapper component
  'icon-diff-wrapper.icon-removed.removed': 'REMOVED',
  'icon-diff-wrapper.icon-added.empty': 'EMPTY',
  'icon-diff-wrapper.content': 'Untitled',

  // NoCollectionBadge - Displayed when no collections are available
  'no-collection-badge.title': 'No available collections.',
  'no-collection-badge.description': 'Check your plugin configuration.',

  // Pagination - Icon search results pagination
  'pagination.total-items.icon_zero': 'icon found',
  'pagination.total-items.icon_one': 'icon found',
  'pagination.total-items.icon_other': 'icons found',

  // ResultsGrid - Icon search results grid
  'results-grid.no-icons-found': 'No icons found!',

  // SvgButtonsBoard - SVG action buttons
  'svg-buttons-board.tooltip.copy-html': 'Copy svg html to clipboard',
  'svg-buttons-board.tooltip.copy-data-url': 'Copy svg Data URL to clipboard',

  // TabPanelAI - AI icon suggestion tab
  // AIPromptInput - AI prompt input component
  'ai-prompt-input.error.prompt-required': 'Please enter a prompt',
  'ai-prompt-input.error.ai-settings-required':
    'AI configuration not available. Please configure your API keys in settings.',
  'ai-prompt-input.error.fail-submission': 'Failed to generate suggestions',
  'ai-prompt-input.api-key-configured':
    'AI API key is configured. You can now use AI-powered icon suggestions.',
  'ai-prompt-input.api-key-not-configured':
    'AI API key not configured. You need to configure your API key before using AI features.',
  'ai-prompt-input.describe-icon': 'Describe the icon you need',
  'ai-prompt-input.prompt-placeholder':
    "Describe the icon (e.g., 'A shopping cart for e-commerce', 'A settings gear with notification badge')",
  'ai-prompt-input.generate-icons':
    'AI will generate 6 icon suggestions by default (only valid icons shown). To request a different number, include "Generate X icon suggestions" in your prompt.',
  'ai-prompt-input.button.generate': 'Generate',
  'ai-prompt-input.current-prompt': 'Current Prompt',

  // AISuggestionCard - AI suggestion card component
  'ai-suggestion-card.button.select-icon': 'Select Icon',

  // AISuggestionsGrid - AI suggestions grid component
  'ai-suggestions-grid.loading': 'Generating icon suggestions...',
  'ai-suggestions-grid.analyzing': 'Analyzing',
  'ai-suggestions-grid.error': 'Error generating suggestions',
  'ai-suggestions-grid.empty.title': 'AI-Powered Icon Suggestions',
  'ai-suggestions-grid.empty.description':
    "Describe what you're looking for and AI will suggest the most relevant icons from popular icon libraries.",
  'ai-suggestions-grid.title': 'AI Suggestions',
  'ai-suggestions-grid.streaming': 'Streaming',

  // TabPanelCollection - Collections tab
  // CollectionsGrid - Collections grid component
  'collections-grid.author-name': 'by {{authorName}}',

  // Step0 - Collections selection step
  'step-0.input-placeholder': 'Filter collections...',

  // Step1 - Icon selection step
  'step-1.author-name': 'by {{authorName}}',
  'step-1.input-placeholder': 'Filter icons...',

  // TabPanelSearch - Search tab
  // SearchInput - Search input component
  'search-input.collection': 'Collection',
  'search-input.collection.all': 'All',
  'search-input.input-placeholder': 'Search icons...',
  'search-input.button-submit-text': 'Search',

  // Tabs - Main dialog tabs
  'tabs.search': 'Search',
  'tabs.collections': 'Collections',
  'tabs.ai': 'AI Suggestions',

  // AISettingsDialog - AI settings dialog
  'ai-settings-dialog.toast.success.title': 'AI Settings Saved',
  'ai-settings-dialog.toast.success.description':
    'Your AI configuration has been updated successfully',
  'ai-settings-dialog.toast.error.title': 'Save Failed',
  'ai-settings-dialog.toast.error.description': 'Failed to save AI settings. Please try again.',
  'ai-settings-dialog.dialog-trigger-button': 'Configure AI API Key',
  'ai-settings-dialog.dialog-header-title': 'AI Settings',
  'ai-settings-dialog.api-keys-title': 'API Keys',
  'ai-settings-dialog.no-providers': 'No AI providers configured',
  'ai-settings-dialog.provider-placeholder': 'Enter your {{providerKeyTitle}}',
  'ai-settings-dialog.button-save': 'Save Settings',

  // Schemas
  // IconManager schema
  'icon-manager.schema.title': 'Icon',
}
```

</details>
<br/>

If you want to add a new language or override one, you need to create a custom bundle with your desired locale. Use `@evelan-de/sanity-plugin-inline-icon-manager` as the namespace and add it to your `sanity.config` file under the `i18n.bundles` attribute. Here is an example:

<br/>

```ts
import { defineLocaleResourceBundle } from 'sanity'

const myEnglishOverride = defineLocaleResourceBundle({
  // make sure the `locale` language code corresponds to the one you want to override
  locale: 'en-US',
  namespace: '@evelan-de/sanity-plugin-inline-icon-manager',
  resources: {
    'app-states.empty-state.select-icon': 'Select your icon',
  },
})

export default defineConfig({
  // ...
  i18n: {
    bundles: [myEnglishOverride],
  },
})
```

<br /><br />

## 🌎 Basic Hosting

The Iconify project allows you to host the API on your server. You can learn more about it in their [official documentation](https://iconify.design/docs/api/hosting.html).\
This plugin offers a basic customization through the `customEndpoint` option. If you pass a valid URL, hosting a custom Iconify implementation, the plugin will use it as the base path for all the interactions (searching and rendering).

```ts
import { defineConfig } from 'sanity'
import { IconManager } from 'sanity-plugin-icon-manager'

export default defineConfig({
  //...
  plugins: [
    IconManager({
      customEndpoint: 'https://my.iconify.project.com',
    }),
  ],
  // ...
})
```

<br /><br />

## 🗃️ Data model

```ts
  {
    _type: 'icon.manager',
    icon: string
    metadata: {
      inlineSvg: string
      color: {
        hex: string
        rgba: {
          r: number
          g: number
          b: number
          a: number
        }
      }
    }
  }
```

<br /><br />

## 📝 License

[MIT](LICENSE) © Evelan De

## 🧪 Develop & test

This plugin uses [@sanity/plugin-kit](https://github.com/sanity-io/plugin-kit)
with default configuration for build & watch scripts.

See [Testing a plugin in Sanity Studio](https://github.com/sanity-io/plugin-kit#testing-a-plugin-in-sanity-studio)
on how to run this plugin with hotreload in the studio.

### Release new version

Run ["CI & Release" workflow](https://github.com/williamiommi/sanity-plugin-i18n-fields/actions/workflows/main.yml).
Make sure to select the main branch and check "Release new version".

Semantic release will only release on configured branches, so it is safe to run release on any branch.
