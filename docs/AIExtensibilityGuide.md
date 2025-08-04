# AI Extensibility Guide

## Overview

The Sanity Inline Icon Manager plugin now supports an extensible AI provider system that allows you to:

- **Use multiple AI providers** (OpenAI, DeepSeek, custom providers)
- **Share AI configurations** across projects using custom secret namespaces
- **Maintain backward compatibility** with existing OpenAI-only setups
- **Extend with custom providers** for your specific needs
- **Simple configuration** with plugin-level defaults

## Quick Start

### Default Usage (No Changes Required)

If you're already using the plugin, **no changes are needed**. The plugin will continue working with your existing OpenAI API key:

```typescript
// Your existing setup continues to work
export default defineConfig({
  plugins: [
    iconManager()
  ]
})
```

### Basic Custom Configuration

```typescript
import { defineConfig } from 'sanity'
import { iconManager } from 'sanity-plugin-inline-icon-manager'

export default defineConfig({
  plugins: [
    iconManager({
      ai: {
        // Use a shared secrets namespace across projects
        secretsNamespace: 'my-company-ai',
        
        // Set a default model for icon suggestions
        defaultModel: {
          model: 'gpt-4o-mini',
          keyName: 'openaiKey'
        }
      }
    })
  ]
})
```

### Advanced Multi-Provider Setup

```typescript
import { defineConfig } from 'sanity'
import { iconManager, createCustomProvider } from 'sanity-plugin-inline-icon-manager'
import { createOpenAI } from '@ai-sdk/openai'
import { createDeepSeek } from '@ai-sdk/deepseek'

export default defineConfig({
  plugins: [
    iconManager({
      ai: {
        secretsNamespace: 'shared-ai-config',
        providers: [
          // Enhanced OpenAI configuration
          {
            name: 'OpenAI',
            keyName: 'openaiKey',
            keyTitle: 'OpenAI API Key',
            models: [
              { type: 'language', modelName: 'gpt-4o' },
              { type: 'language', modelName: 'gpt-4o-mini' },
              { type: 'language', modelName: 'o1-mini' },
            ],
            createInstance: (apiKey) => createOpenAI({ 
              apiKey, 
              compatibility: 'strict' 
            })
          },
          
          // Add DeepSeek support
          {
            name: 'DeepSeek',
            keyName: 'deepseekKey', 
            keyTitle: 'DeepSeek API Key',
            models: [
              { type: 'language', modelName: 'deepseek-chat' }
            ],
            createInstance: (apiKey) => createDeepSeek({ apiKey })
          }
        ],
        
        // Use DeepSeek as default (cost-effective)
        defaultModel: {
          model: 'deepseek-chat',
          keyName: 'deepseekKey'
        }
      }
    })
  ]
})
```

## Configuration Options

### AI Plugin Configuration

```typescript
interface AIPluginConfig {
  /** Custom secret namespace (defaults to 'ai-icon-suggestions') */
  secretsNamespace?: string
  
  /** Custom provider configurations (optional - uses defaults if not provided) */
  providers?: AIProvider[]
  
  /** Default model selection (optional - uses internal default if not provided) */
  defaultModel?: AIModelChoiceType
}
```

### AI Provider Interface

```typescript
interface AIProvider {
  /** Display name for the provider (e.g., "OpenAI", "DeepSeek") */
  name: string
  
  /** Secret key name for API key storage (e.g., "openaiKey", "deepseekKey") */
  keyName: string
  
  /** Human-readable title for settings UI (e.g., "OpenAI API Key") */
  keyTitle: string
  
  /** Available models for this provider */
  models: LanguageModelType[]
  
  /** Function to create provider instance with API key */
  createInstance: (apiKey: string) => Provider
}
```

## Usage Examples

### Example 1: Shared Configuration Across Projects

```typescript
// Project A - Main application
export default defineConfig({
  plugins: [
    iconManager({
      ai: {
        secretsNamespace: 'acme-company-ai'
      }
    })
  ]
})

// Project B - Documentation site  
export default defineConfig({
  plugins: [
    iconManager({
      ai: {
        secretsNamespace: 'acme-company-ai' // Same namespace = shared secrets
      }
    })
  ]
})
```

### Example 2: Cost-Optimized Setup with DeepSeek

```typescript
export default defineConfig({
  plugins: [
    iconManager({
      ai: {
        providers: [
          {
            name: 'DeepSeek',
            keyName: 'deepseekKey',
            keyTitle: 'DeepSeek API Key',
            models: [{ type: 'language', modelName: 'deepseek-chat' }],
            createInstance: (apiKey) => createDeepSeek({ apiKey })
          }
        ],
        defaultModel: {
          model: 'deepseek-chat',
          keyName: 'deepseekKey'
        }
      }
    })
  ]
})
```

### Example 3: Custom Provider Integration

```typescript
import { createCustomProvider } from 'sanity-plugin-inline-icon-manager'

const myCustomProvider = createCustomProvider({
  name: 'My Custom AI',
  keyName: 'customAiKey',
  keyTitle: 'Custom AI API Key',
  models: ['custom-model-v1', 'custom-model-v2'],
  createInstance: (apiKey) => {
    // Your custom provider implementation
    return createMyCustomAI({ apiKey })
  }
})

export default defineConfig({
  plugins: [
    iconManager({
      ai: {
        providers: [myCustomProvider]
      }
    })
  ]
})
```

## Migration Guide

### From Legacy OpenAI-Only Setup

**Before (Legacy):**
```typescript
// Old setup - still works but limited
export default defineConfig({
  plugins: [iconManager()]
})
// Uses hardcoded 'ai-icon-suggestions' namespace
// Only supports OpenAI models
// API key stored as 'openaiApiKey'
```

**After (Enhanced):**
```typescript
// New setup - extensible and future-proof
export default defineConfig({
  plugins: [
    iconManager({
      ai: {
        secretsNamespace: 'my-project-ai',
        providers: [
          // OpenAI with more models
          {
            name: 'OpenAI',
            keyName: 'openaiKey',
            keyTitle: 'OpenAI API Key',
            models: [
              { type: 'language', modelName: 'gpt-4o' },
              { type: 'language', modelName: 'gpt-4o-mini' },
              { type: 'language', modelName: 'o1-mini' }
            ],
            createInstance: (apiKey) => createOpenAI({ apiKey })
          },
          
          // Add cost-effective alternative
          {
            name: 'DeepSeek',
            keyName: 'deepseekKey',
            keyTitle: 'DeepSeek API Key', 
            models: [{ type: 'language', modelName: 'deepseek-chat' }],
            createInstance: (apiKey) => createDeepSeek({ apiKey })
          }
        ]
      }
    })
  ]
})
```

**Migration Steps:**
1. Update your plugin configuration with new AI options
2. The system will automatically migrate your existing `openaiApiKey` to `openaiKey`
3. Configure additional providers as needed
4. Set a global default model in the settings UI

## UI Components

### Enhanced Settings Dialog

The plugin now includes a dynamic settings dialog that adapts to your provider configuration:

```typescript
import { AISettingsDialog } from 'sanity-plugin-inline-icon-manager'

// Use in your custom components
function MyCustomTool() {
  return (
    <AISettingsDialog 
      namespace="my-custom-namespace"
      onSave={() => console.log('Settings saved!')}
    />
  )
}
```

### Provider Status Component

Monitor the health of your AI providers:

```typescript
import { AIProviderStatus } from 'sanity-plugin-inline-icon-manager'

function MyDashboard() {
  return (
    <AIProviderStatus 
      detailed={true}
      onSetupClick={() => openSettingsDialog()}
    />
  )
}
```

### Language Model Selector

Allow users to select from available models:

```typescript
import { LanguageModelSelector } from 'sanity-plugin-inline-icon-manager'

function ModelPicker() {
  const [selectedModel, setSelectedModel] = useState()
  
  return (
    <LanguageModelSelector
      model={selectedModel}
      setModel={setSelectedModel}
      secretsState={{ secrets: mySecrets, loading: false }}
      withLabel={true}
    />
  )
}
```

## Hooks and Utilities

### useAISettings Hook

Get AI configuration with type safety:

```typescript
import { useAISettings } from 'sanity-plugin-inline-icon-manager'

function MyComponent() {
  const { engine, error, loading } = useAISettings({
    namespace: 'my-namespace'
  })
  
  if (loading) return <div>Loading...</div>
  if (error) return <div>Please configure AI settings</div>
  
  // Use engine for AI operations
  return <div>AI ready with {engine.model.modelName}</div>
}
```

### useAISecrets Hook

Access secrets with custom namespace support:

```typescript
import { useAISecrets } from 'sanity-plugin-inline-icon-manager'

function SecretManager() {
  const { 
    secrets, 
    loading, 
    storeSecrets, 
    hasValidApiKey 
  } = useAISecrets('my-namespace')
  
  const isOpenAIReady = hasValidApiKey('openaiKey')
  const isDeepSeekReady = hasValidApiKey('deepseekKey')
  
  return (
    <div>
      <div>OpenAI: {isOpenAIReady ? '✅' : '❌'}</div>
      <div>DeepSeek: {isDeepSeekReady ? '✅' : '❌'}</div>
    </div>
  )
}
```

### Migration Utilities

Handle automatic migration from legacy setups:

```typescript
import { 
  migrateLegacySecrets, 
  needsMigration,
  autoMigrateSecrets 
} from 'sanity-plugin-inline-icon-manager'

// Check if migration is needed
if (needsMigration(currentSecrets)) {
  const result = await autoMigrateSecrets(currentSecrets, storeSecrets)
  
  if (result.success) {
    console.log('Migration successful:', result.warnings)
  } else {
    console.error('Migration failed:', result.errors)
  }
}
```

## Best Practices

### 1. Use Shared Namespaces for Team Projects

```typescript
// Good: Consistent namespace across team projects
const TEAM_AI_NAMESPACE = 'acme-design-team-ai'

export default defineConfig({
  plugins: [
    iconManager({
      ai: { secretsNamespace: TEAM_AI_NAMESPACE }
    })
  ]
})
```

### 2. Provide Fallback Providers

```typescript
// Good: Multiple providers for reliability
export default defineConfig({
  plugins: [
    iconManager({
      ai: {
        providers: [
          openAIProvider,
          deepSeekProvider, // Fallback option
        ],
        defaultModel: {
          model: 'gpt-4o-mini', // Primary choice
          keyName: 'openaiKey'
        }
      }
    })
  ]
})
```

### 3. Use Cost-Effective Models as Defaults

```typescript
// Good: Cost-effective default with premium options available
export default defineConfig({
  plugins: [
    iconManager({
      ai: {
        defaultModel: {
          model: 'deepseek-chat', // Cheaper default
          keyName: 'deepseekKey'
        }
      }
    })
  ]
})
```

### 4. Validate Configuration

```typescript
import { validatePluginConfig } from 'sanity-plugin-inline-icon-manager'

const config = {
  ai: {
    providers: [/* your providers */],
    defaultModel: { model: 'gpt-4o-mini', keyName: 'openaiKey' }
  }
}

const validation = validatePluginConfig(config)
if (!validation.isValid) {
  console.error('Configuration errors:', validation.errors)
}
```

## Troubleshooting

### Common Issues

**1. "No AI providers configured"**
- Ensure your plugin configuration includes valid providers
- Check that provider configurations are properly formatted

**2. "API key required" errors**
- Configure API keys in the settings dialog
- Verify the key names match your provider configuration

**3. "Model not found" errors**
- Ensure the model exists in your provider's model list
- Check that the model name is spelled correctly

**4. Migration issues**
- Use the migration utilities to handle legacy secret formats
- Check the browser console for migration warnings

### Debug Information

Enable debug logging to troubleshoot issues:

```typescript
import { getAISystemStatus } from 'sanity-plugin-inline-icon-manager'

// Get system status
const status = getAISystemStatus()
console.log('AI System Status:', status)

// Check provider registry
console.log('Providers:', status.providerNames)
console.log('Cache Stats:', status.cacheStats)
```

## Advanced Usage

### Custom Provider Implementation

Create a completely custom AI provider:

```typescript
import { Provider } from 'ai'

class MyCustomProvider implements Provider {
  constructor(private apiKey: string) {}
  
  languageModel(modelName: string) {
    // Your implementation
    return new MyCustomLanguageModel(this.apiKey, modelName)
  }
}

const customProvider = {
  name: 'My Custom AI',
  keyName: 'customKey',
  keyTitle: 'Custom AI Key',
  models: [{ type: 'language', modelName: 'custom-v1' }],
  createInstance: (apiKey) => new MyCustomProvider(apiKey)
}
```

### Programmatic AI Service Usage

Use the enhanced AI service directly:

```typescript
import { EnhancedAIIconService } from 'sanity-plugin-inline-icon-manager'

const engine = {
  model: { type: 'language', modelName: 'gpt-4o-mini' },
  keyName: 'openaiKey',
  apiKey: 'your-api-key'
}

// Generate suggestions
const suggestions = await EnhancedAIIconService.generateIconSuggestions(
  'shopping cart icons',
  engine
)

// Stream suggestions
for await (const batch of EnhancedAIIconService.streamIconSuggestions(
  'navigation icons',
  engine
)) {
  console.log('New suggestions:', batch)
}
```

## Support

For issues, questions, or feature requests:

1. Check the [GitHub Issues](https://github.com/your-repo/issues)
2. Review the [Migration Guide](#migration-guide)
3. Enable debug logging for troubleshooting
4. Provide configuration details when reporting issues

---

This extensible AI system maintains full backward compatibility while providing powerful new capabilities for team collaboration and cost optimization.
