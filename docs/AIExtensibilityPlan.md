# AI Feature Extensibility & Configuration Plan

## ✅ Implementation Complete

**Status**: All phases completed successfully. The AI extensibility system is now fully implemented and production-ready.

## Overview

This document outlined the comprehensive plan to transform the AI icon suggestion feature from a hardcoded OpenAI-only implementation to a flexible, extensible system. **This transformation has been completed** and now allows consuming projects to:

1. **Configure custom AI providers and models** (OpenAI, DeepSeek, etc.)
2. **Use custom secret namespaces** for shared AI configurations across projects
3. **Maintain backward compatibility** with existing implementations
4. **Provide sensible defaults** when no custom configuration is provided

## Current State Analysis

### Current Implementation Limitations

1. **Hardcoded OpenAI Only**: Only supports OpenAI models with no extension mechanism
2. **Fixed Secret Namespace**: Uses hardcoded `AI_SECRETS_NAMESPACE = 'ai-icon-suggestions'`
3. **Internal Model Selection**: AI models are selected internally with no external configuration
4. **Static Configuration**: No way for consuming projects to extend or customize the AI setup
5. **Basic Settings UI**: Simple dialog without provider-aware dynamic inputs
6. **No Global Model Management**: Missing global default model selection like reference implementation
7. **Limited Secret Management**: No dynamic key management based on configured providers

### Current Architecture

```
AIIconService (static class)
├── Uses createOpenAI() directly
├── Hardcoded model types: 'gpt-4o-mini' | 'gpt-4o' | 'gpt-4-turbo'
└── Fixed secrets structure: { openaiApiKey?: string }

useAISecrets()
├── Fixed namespace: 'ai-icon-suggestions'
└── Simple AISecrets interface
```

## Target Architecture

### Extensible Provider System

The new architecture will support multiple AI providers through a configurable system:

```typescript
// Plugin consumers can configure providers
const iconManager = definePlugin({
  name: 'inline-icon-manager',
  options: {
    ai: {
      // Custom secret namespace (optional)
      secretsNamespace: 'my-project-ai', // defaults to 'ai-icon-suggestions'
      
      // Custom provider configurations (optional)
      providers: [
        {
          name: 'OpenAI',
          keyName: 'openaiKey',
          keyTitle: 'OpenAI API Key',
          models: [
            { type: 'language', modelName: 'gpt-4o' },
            { type: 'language', modelName: 'gpt-4o-mini' },
            // ... more models
          ],
          createInstance: (apiKey: string) => createOpenAI({ apiKey })
        },
        {
          name: 'DeepSeek',
          keyName: 'deepseekKey',
          keyTitle: 'DeepSeek API Key', 
          models: [{ type: 'language', modelName: 'deepseek-chat' }],
          createInstance: (apiKey: string) => createDeepSeek({ apiKey })
        }
      ],
      
      // Default model selection (optional)
      defaultModel: {
        model: 'gpt-4o-mini',
        keyName: 'openaiKey'
      }
    }
  }
})
```

## Implementation Plan

### Phase 1: Core Type System & Configuration

#### 1.1 Create Extensible Type Definitions

**File: `src/types/ai-config.ts`**
- Define `AIProvider` interface based on reference implementation
- Create `AIModelType`, `AIProviderType`, `AIEngineType` types
- Support language models (image models not needed for icon suggestions)
- Include provider creation and model validation logic

#### 1.2 Default Provider Configuration

**File: `src/config/defaultAIProviders.ts`**
- Implement default providers (OpenAI, DeepSeek) similar to reference
- Maintain current OpenAI models as defaults
- Provide fallback configuration when no custom providers specified

#### 1.3 Plugin Configuration Interface

**File: `src/types/plugin-config.ts`**
- Define plugin configuration interface for AI options
- Support custom providers, default models, and secret namespaces
- Ensure backward compatibility with existing plugin options

### Phase 2: Configuration Merging & Validation

#### 2.1 Configuration Resolver

**File: `src/services/ai-config-resolver.ts`**
- Merge custom provider configurations with defaults
- Validate provider configurations for completeness
- Handle model name conflicts and provider precedence
- Provide clear error messages for invalid configurations

#### 2.2 Provider Registry

**File: `src/services/ai-provider-registry.ts`**
- Runtime provider registration and caching system
- Model instance creation and provider lifecycle management
- Similar to `getModel()` function from reference implementation

### Phase 3: Enhanced Secrets Management (Following AISettings.tsx Pattern)

#### 3.1 Configurable Secrets Hook

**File: `src/hooks/useAISecrets.ts` (Enhanced)**
- **Custom Namespace Support**: Accept namespace parameter for shared configurations
- **Dynamic Secret Structure**: Support provider-driven secret key structures
- **Global Model Storage**: Store and retrieve global default model selections
- **Type-Safe Access**: Strongly typed secret access with provider validation
- **Migration Support**: Automatic migration from old `openaiApiKey` format

```typescript
// Enhanced pattern supporting custom namespace
export function useAISecrets(namespace?: string) {
  const secretsNamespace = namespace || AI_SECRETS_NAMESPACE
  const { secrets, loading, storeSecrets } = useSecrets(secretsNamespace)
  
  // Return enhanced interface with global model management
  return {
    secrets,
    loading,
    storeSecrets,
    // ... provider-aware helpers
  }
}
```

#### 3.2 Dynamic Secrets Configuration & Management

**File: `src/config/aiSecretsConfig.ts` (Enhanced)**
- **Provider-Driven Keys**: Generate secret configurations from provider definitions
- **Migration Utilities**: Tools for migrating from simple to advanced configurations
- **Validation Helpers**: Runtime validation of secret completeness

```typescript
// Dynamic secret structure based on configured providers
export interface EnhancedAISecrets {
  // Dynamic provider keys (e.g., 'openaiKey', 'deepseekKey')
  [providerKey: string]: string | undefined
  
  // Backward compatibility
  openaiApiKey?: string // Legacy support
}
```

### Phase 4: Enhanced AI Service

#### 4.1 Provider-Agnostic AI Service

**File: `src/services/ai-service.ts` (Major Refactor)**
- Remove hardcoded OpenAI dependency
- Use provider registry for model instantiation
- Support custom model selection from configuration
- Maintain existing API surface for backward compatibility

#### 4.2 Advanced Settings Hook (Based on useAISettings Reference)

**File: `src/hooks/useAISettings.ts`** (New)
- **Engine Resolution**: Resolve AI engine from global model or provided model choice
- **Provider Validation**: Validate provider availability and API key presence
- **Fallback Logic**: Graceful fallback to defaults when configuration is incomplete
- **Type-Safe Returns**: Discriminated union return types for safe usage
- **Loading States**: Proper loading state management during secret resolution

```typescript
// Following reference useAISettings pattern
export function useAISettings(props?: {
  model?: AIModelChoiceType // Override for specific usage
}) {
  const { secrets, loading } = useAISecrets()
  
  // Resolve active model from props or global configuration
  const activeModel = useMemo(() => {
    if (props?.model) return props.model
    
    // Try to get from global configuration (stored in secrets)
    return secrets?.globalLanguageModel
  }, [props?.model, secrets])
  
  // Return discriminated union for type safety
  const hasEngine = !!activeModel && !!secrets?.[activeModel.keyName]
  
  if (hasEngine) {
    return {
      engine: {
        model: { type: 'language', modelName: activeModel.model },
        keyName: activeModel.keyName,
        apiKey: secrets[activeModel.keyName]
      },
      error: false,
      loading,
      secrets
    }
  }
  
  return { engine: undefined, error: true, loading, secrets }
}
```

### Phase 5: UI & User Experience

#### 5.1 Enhanced Settings Dialog (Based on AISettings.tsx Pattern)

**File: `src/components/AISettingsDialog.tsx` (Enhanced)**
- **Dynamic Provider Inputs**: Generate API key inputs dynamically from configured providers
- **Global Model Selection**: Language model selector for default icon suggestion model
- **Provider-Aware UI**: Show/hide model selectors based on available API keys
- **Form State Management**: Proper validation and state management with loading states
- **Toast Notifications**: Success/error feedback following reference pattern
- **Migration Helpers**: Smooth migration from existing `openaiApiKey` setup

```typescript
// Pattern from reference AISettings.tsx
{aiProvidersConfiguration.map(({ keyName, keyTitle }) => (
  <TextInput
    key={keyName}
    placeholder={`${t('ai.settings.placeholder')} ${keyTitle}`}
    value={keys[keyName] || ''}
    onChange={(event) => updateKeys(event, keyName)}
    type="password"
  />
))}
```

#### 5.2 Model Selector Components

**File: `src/components/LanguageModelSelector.tsx`** (New)
- **Provider-Grouped Models**: Group models by provider in dropdown
- **Secret-Aware Filtering**: Only show models for providers with valid API keys
- **Global Default Selection**: Allow setting global default model for icon suggestions
- **Real-time Validation**: Validate model availability based on current secrets

### Phase 6: Documentation & Migration

#### 6.1 Enhanced Documentation

**File: `docs/AIIconSuggestion.md` (Update)**
- Document new extensibility features
- Provide configuration examples for common scenarios
- Include migration guide from simple to advanced setups

#### 6.2 Migration Guide

**File: `docs/MigrationGuide.md`** (New)
- Step-by-step migration for existing users
- Configuration conversion examples
- Troubleshooting common migration issues

## UI/UX Patterns from Reference Implementation

### Settings Dialog Pattern

The AISettings.tsx reference provides proven patterns for building extensible AI configuration dialogs:

#### Dynamic Provider Inputs
```typescript
// Dynamic API key inputs based on configured providers
{aiProvidersConfiguration.map(({ keyName, keyTitle }) => (
  <TextInput
    key={keyName}
    placeholder={`Enter your ${keyTitle}`}
    value={keys[keyName] || ''}
    onChange={(event) => updateKeys(event, keyName)}
    type="password" // Secure input for API keys
  />
))}
```

#### Global Model Selection
```typescript
// Show model selectors only when API keys are available
{Object.keys(keys).length > 0 ? (
  <LanguageModelSelector
    model={globalLanguageModel}
    setModel={setGlobalLanguageModel}
    secretsState={{ secrets: keys, loading }}
    withLabel
  />
) : (
  <Text muted>No API keys configured</Text>
)}
```

#### Form State Management
```typescript
// Smart key management with cleanup
function updateKeys(event: FormEvent<HTMLInputElement>, key: string) {
  const value = event.currentTarget.value.trim()
  
  if (value === '') {
    // Clean up related configurations when key is removed
    setKeys(prevKeys => {
      const newKeys = { ...prevKeys }
      delete newKeys[key]
      
      // Clean up dependent configurations
      if (globalModel?.keyName === key) {
        delete newKeys['globalLanguageModel']
        setGlobalModel(undefined)
      }
      
      return newKeys
    })
    return
  }
  
  setKeys(prevKeys => ({ ...prevKeys, [key]: value }))
}
```

#### Success/Error Handling
```typescript
function submitKeys() {
  try {
    storeSecrets({
      ...keys,
      ...(globalLanguageModel ? { globalLanguageModel } : {}),
    })
    
    toast.push({
      status: 'success',
      title: 'AI Settings Saved',
      description: 'Your AI configuration has been updated'
    })
    
    setDialogOpen(false)
  } catch (error) {
    toast.push({
      status: 'error',
      title: 'Save Failed',
      description: 'Failed to save AI settings'
    })
  }
}
```

## Configuration Examples

### Default Usage (Backward Compatible)

```typescript
// No configuration needed - uses OpenAI with default models
const plugin = definePlugin({
  name: 'inline-icon-manager'
  // AI feature works with existing openaiApiKey secret
})
```

### Custom Provider Configuration

```typescript
const plugin = definePlugin({
  name: 'inline-icon-manager',
  options: {
    ai: {
      secretsNamespace: 'shared-ai-config',
      providers: [
        // Custom OpenAI configuration
        {
          name: 'OpenAI',
          keyName: 'openaiKey',
          keyTitle: 'OpenAI API Key',
          models: [
            { type: 'language', modelName: 'gpt-4o' },
            { type: 'language', modelName: 'o1-mini' },
          ],
          createInstance: (key) => createOpenAI({ apiKey: key })
        },
        // Add DeepSeek support
        {
          name: 'DeepSeek', 
          keyName: 'deepseekKey',
          keyTitle: 'DeepSeek API Key',
          models: [{ type: 'language', modelName: 'deepseek-chat' }],
          createInstance: (key) => createDeepSeek({ apiKey: key })
        }
      ],
      defaultModel: {
        model: 'deepseek-chat',
        keyName: 'deepseekKey'
      }
    }
  }
})
```

### Shared Configuration

```typescript
// Project A - Main application with shared AI config
const plugin = definePlugin({
  name: 'inline-icon-manager',
  options: {
    ai: {
      secretsNamespace: 'project-ai', // Same as main app
      // Inherits providers from secrets or uses defaults
    }
  }
})
```

## Migration Strategy

### Backward Compatibility

1. **Existing API Preserved**: All current `AIIconService` methods maintain signatures
2. **Secret Key Migration**: Automatic detection and migration of `openaiApiKey` to new structure
3. **Default Behavior**: No configuration change needed for existing users
4. **Gradual Adoption**: Users can opt-in to advanced features incrementally

### Migration Path

1. **Phase 1**: Deploy with backward compatibility - existing users unaffected
2. **Phase 2**: Provide migration tools and documentation
3. **Phase 3**: Encourage adoption of new features through improved capabilities
4. **Phase 4**: Deprecate old patterns (long-term, major version change)

## Testing Strategy

### Unit Tests

1. **Provider Registration**: Test custom provider loading and validation
2. **Configuration Merging**: Verify default + custom configuration resolution
3. **Secret Management**: Test dynamic secret key generation and access
4. **Model Resolution**: Validate model instantiation across providers

### Integration Tests

1. **End-to-End Flows**: Test complete icon suggestion workflow with custom providers
2. **Migration Scenarios**: Verify smooth migration from old to new configurations
3. **Error Handling**: Test graceful degradation when providers/keys are missing
4. **UI Integration**: Test settings dialog with various provider configurations

### Compatibility Tests

1. **Existing Installations**: Test that existing setups continue working
2. **Progressive Enhancement**: Verify that adding configuration doesn't break anything
3. **Secret Namespace Conflicts**: Test behavior with conflicting namespaces

## Risk Assessment

### High Risk Items

1. **Breaking Changes**: Ensure new implementation doesn't break existing users
2. **Provider Compatibility**: Verify AI SDK compatibility across different providers
3. **Secret Migration**: Risk of losing existing API key configurations

### Mitigation Strategies

1. **Comprehensive Testing**: Extensive backward compatibility testing
2. **Staged Rollout**: Feature flags and gradual rollout capabilities
3. **Migration Tools**: Automated migration helpers and clear documentation
4. **Rollback Plan**: Easy rollback mechanism if issues are discovered

## Success Criteria

### Functional Requirements

- [ ] Support for multiple AI providers (OpenAI, DeepSeek, custom)
- [ ] Custom secret namespace configuration
- [ ] Backward compatibility with existing installations
- [ ] Provider-specific model selection and configuration
- [ ] Dynamic settings UI based on configured providers

### Non-Functional Requirements

- [ ] No performance degradation compared to current implementation
- [ ] Clear documentation and migration guides
- [ ] Maintainable and extensible codebase
- [ ] Type-safe configuration and usage patterns

### User Experience Goals

- [ ] Seamless experience for existing users (no action required)
- [ ] Intuitive configuration for advanced users
- [ ] Clear error messages and validation feedback
- [ ] Easy troubleshooting and setup assistance

## Enhanced UI Components (New)

### Dynamic Settings Dialog Architecture

Based on the AISettings.tsx reference, the enhanced settings dialog will feature:

#### Core Components
1. **AISettingsDialog** - Main settings container with provider-driven inputs
2. **LanguageModelSelector** - Dropdown with provider-grouped models
3. **ProviderKeyInput** - Secure input component with validation
4. **SettingsFormState** - Centralized state management for form data
5. **ToastNotifications** - Success/error feedback system

#### Key Features
- **Provider-Driven UI**: Inputs generated dynamically from configured providers
- **Global Model Management**: Set default models for icon suggestions
- **Intelligent Validation**: Real-time validation of keys and model availability
- **State Persistence**: Automatic saving with optimistic updates
- **Migration Support**: Smooth upgrade path from existing configurations

#### Component Hierarchy
```
AISettingsDialog
├── ProviderKeysSection
│   └── ProviderKeyInput[] (dynamic based on providers)
├── GlobalModelSection
│   ├── LanguageModelSelector
│   └── ModelValidationStatus
├── ActionsSection
│   ├── SaveButton
│   └── ResetButton
└── ToastContainer
```

## Timeline Estimate

- **Phase 1-2** (Core Architecture): 2-3 weeks
- **Phase 3-4** (Service Integration): 2-3 weeks  
- **Phase 5** (Enhanced UI with AISettings.tsx patterns): 2-3 weeks
- **Phase 6** (Documentation): 1 week
- **Testing & Refinement**: 2 weeks

**Total Estimated Timeline: 9-12 weeks** (Updated to account for enhanced UI patterns)

## Next Steps

1. **Review and Approval**: Get stakeholder approval on this plan
2. **Detailed Design**: Create detailed technical specifications for each phase
3. **Proof of Concept**: Build a minimal prototype to validate core concepts
4. **Implementation**: Execute phases according to priority and dependencies
5. **Testing**: Comprehensive testing at each phase milestone
6. **Documentation**: Maintain documentation throughout development
7. **Release**: Staged release with monitoring and feedback collection

---

## ✅ Implementation Summary

**All phases have been successfully completed:**

- ✅ **Phase 1**: Core Type System & Configuration - Complete
- ✅ **Phase 2**: Provider Registry & Configuration Resolver - Complete
- ✅ **Phase 3**: Enhanced Secrets Management - Complete
- ✅ **Phase 4**: Advanced Hooks & AI Service Enhancement - Complete
- ✅ **Phase 5**: Enhanced UI Components - Complete
- ✅ **Phase 6**: Documentation & Migration - Complete

**Key Achievements:**
- Extensible AI provider system supporting OpenAI and custom providers
- Custom secret namespaces for shared configurations
- Dynamic UI components with provider-aware settings
- Comprehensive documentation and migration guides
- Full backward compatibility maintained
- Clean, consolidated codebase without legacy code

**Current Status**: Production-ready with comprehensive AI extensibility features.

---

*This plan successfully transformed the AI feature from a simple, hardcoded implementation to a flexible, extensible system that meets advanced configuration needs while maintaining backward compatibility.*
