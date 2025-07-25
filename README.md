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

The plugin includes an AI-powered icon suggestion feature that allows you to discover relevant icons using natural language prompts. Simply describe what you're looking for, and the AI will suggest appropriate icons from various icon libraries.

### Key Features

- Natural language prompts to find icons (e.g., "shopping cart for e-commerce")
- Real-time streaming of suggestions as they're generated
- Automatic validation to ensure only existing icons are suggested
- Customizable AI model selection
- Detailed reasoning for each suggested icon

For detailed documentation on the AI suggestion feature, see [AIIconSuggestion.md](./docs/AIIconSuggestion.md) in the docs folder.

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
