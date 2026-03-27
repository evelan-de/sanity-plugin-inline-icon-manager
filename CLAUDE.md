# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run build        # Verify package + build dist (CJS + ESM)
npm run watch        # Watch mode during development
npm run link-watch   # Link-watch for testing in a consuming Sanity project
npm run lint         # ESLint
npm run lint-fix     # ESLint with auto-fix
npm run format       # Prettier (writes in place)
```

There is no test suite. Verification is done by building and manually testing in a Sanity Studio via `link-watch`.

Commits must follow Conventional Commits (enforced by commitlint + Husky). Releases are automated via `@sanity/semantic-release-preset`.

## Architecture

### Package Exports

Three public entry points:

| Export | Source | Purpose |
|--------|--------|---------|
| `.` (main) | `src/index.ts` | Plugin + AI types |
| `./types` | `src/exports/types/index.ts` | Standalone type-only export |
| `./renderer` | `src/exports/components/IconInlineRenderer/index.ts` | Renderer component for consuming apps |

### Plugin Entry

`src/plugin/plugin.ts` — Registers the Sanity schema type and i18n bundles via `definePlugin`. `src/lib/iconManagerSetup.ts` runs one-time setup from plugin options.

### State Management

Zustand store with 8 slices, composed in `src/store/context.tsx`. The store is **not a global singleton** — it is created per-field-instance using `useRef` inside `AppStoreContextProvider`, so multiple icon fields on the same document are fully isolated.

Slices and their responsibilities:
- `SanitySlice` — Sanity patch function, current document value, toast ref
- `PluginOptionsSlice` — Plugin config (endpoint, palette, `storeInlineSvg`, collections, AI config)
- `IconSlice` — Currently selected icon (name, collection, etc.)
- `ConfigureSlice` — Color and inline SVG customization state + save logic
- `FiltersSlice` — Search filters (collection, style, palette, limit)
- `ResultsSlice` — Iconify search results + pagination
- `CollectionsSlice` — Available Iconify collections list
- `DialogSlice` — Open/close state for Search, Config, Remove dialogs
- `AISlice` — AI suggestion state (prompt, results, streaming)

Slices cross-reference each other via intersection types (e.g., `ConfigureSlice & SanitySlice & DialogSlice`). This causes import cycles; files suppress them with `/* eslint-disable import/no-cycle */`.

Access state in components: `useAppStoreContext((s) => s.someValue)`.

### AI System (`src/services/`)

Extensible multi-provider architecture. Default provider is OpenAI via `@ai-sdk/openai`.

- `ai-provider-registry.ts` — `AIProviderRegistry` interface; manages provider instances with caching
- `ai-system-initializer.ts` — Bootstraps the registry from plugin config
- `ai-config-resolver.ts` — Resolves which provider/model to use at runtime
- `ai-service.ts` — Calls the language model with streaming, validates icon names against Iconify

External consumers can add custom providers by passing `FlexibleAIProvider[]` to `IconManagerPluginOptions.ai.providers`. API keys are stored in Sanity Studio secrets (`@sanity/studio-secrets`) under a configurable namespace (default: `'ai-icon-suggestions'`).

### Schema

`src/schemas/objects/IconManager/` — Main Sanity object type. Fields defined in `metadata.ts` and `extra.fields.ts`. The schema shape depends on the `storeInlineSvg` plugin option.

### i18n

English (`en`) and German (`de`) bundles in `src/i18n/`. Registered in the plugin return value.

### `storeInlineSvg` Option

The key differentiator from the upstream `sanity-plugin-icon-manager`. When `true`, the plugin always writes the rendered SVG HTML to `metadata.inlineSvg` on save. When `false` (default), it only stores SVG if the user explicitly adds inline SVG customization.
