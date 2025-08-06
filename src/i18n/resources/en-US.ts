/**
 * English (US) translations for Sanity Plugin Inline Icon Manager
 * This file contains all English translations for the plugin
 */
export default {
  // AppStates
  'app-states.empty-state.select-icon': 'Select icon',
  'app-states.filled-state.icon-customized': 'Icon has been customized',

  // ButtonsBoard
  'buttons-board.tooltip.customize-icon': 'Customize Icon',
  'buttons-board.tooltip.change-icon': 'Change Icon',
  'buttons-board.tooltip.delete-icon': 'Delete Icon',

  // Dialogs
  // ConfigDialog
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

  // RemoveDialog
  'remove-dialog.button.cancel': 'Cancel',
  'remove-dialog.button.confirm': 'Confirm',
  'remove-dialog.dialog.text': 'Do you really want to remove the icon?',

  // SearchDialog
  'search-dialog.header.title': 'Find your icon',

  // Filters
  // FilterCollection
  'filter-collection.title': 'Collection',
  'filter-collection.select': 'Select...',

  // FilterLimit
  'filte-limit.title': 'Limit',
  'filte-limit.min-max': 'min 32 / max 999',

  // FilterPalette
  'filter-palette.title': 'Palette',
  'filter-palette.select': 'Select...',

  // FilterStyle
  'filter-style.title': 'Style',
  'filter-style.select': 'Select...',

  // IconManagerDiffComponent
  // IconDiffChangeList
  'icon-diff-change-list.button.hide-details': 'Hide details',
  'icon-diff-change-list.button.show-details': 'Show details',

  // IconDiffWrapper
  'icon-diff-wrapper.icon-removed.removed': 'REMOVED',
  'icon-diff-wrapper.icon-added.empty': 'EMPTY',
  'icon-diff-wrapper.content': 'Untitled',

  // NoCollectionBadge
  'no-collection-badge.title': 'No available collections.',
  'no-collection-badge.description': 'Check your plugin configuration.',

  // Pagination
  'pagination.total-items.icon_zero': 'icon found',
  'pagination.total-items.icon_one': 'icon found',
  'pagination.total-items.icon_other': 'icons found',

  // ResultsGrid
  'results-grid.no-icons-found': 'No icons found!',

  // SvgButtonsBoard
  'svg-buttons-board.tooltip.copy-html': 'Copy svg html to clipboard',
  'svg-buttons-board.tooltip.copy-data-url': 'Copy svg Data URL to clipboard',

  // TabPanelAI
  // AIPromptInput
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

  // AISuggestionCard
  'ai-suggestion-card.button.select-icon': 'Select Icon',

  // AISuggestionsGrid
  'ai-suggestions-grid.loading': 'Generating icon suggestions...',
  'ai-suggestions-grid.analyzing': 'Analyzing',
  'ai-suggestions-grid.error': 'Error generating suggestions',
  'ai-suggestions-grid.empty.title': 'AI-Powered Icon Suggestions',
  'ai-suggestions-grid.empty.description':
    "Describe what you're looking for and AI will suggest the most relevant icons from popular icon libraries.",
  'ai-suggestions-grid.title': 'AI Suggestions',
  'ai-suggestions-grid.streaming': 'Streaming',

  // TabPanelCollection
  // CollectionsGrid
  'collections-grid.author-name': 'by {{authorName}}',

  // Step0
  'step-0.input-placeholder': 'Filter collections...',

  // Step1
  'step-1.author-name': 'by {{authorName}}',
  'step-1.input-placeholder': 'Filter icons...',

  // TabPanelSearch
  // SearchInput
  'search-input.collection': 'Collection',
  'search-input.collection.all': 'All',
  'search-input.input-placeholder': 'Search icons...',
  'search-input.button-submit-text': 'Search',

  // Tabs
  'tabs.search': 'Search',
  'tabs.collections': 'Collections',
  'tabs.ai': 'AI Suggestions',

  // AISettingsDialog
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

  // useSvgUtils
  'use-svg-utils.copy-to-clipboard': 'Copy to clipboard',

  // Schemas
  // IconManager schema
  'icon-manager.schema.title': 'Icon',
}
