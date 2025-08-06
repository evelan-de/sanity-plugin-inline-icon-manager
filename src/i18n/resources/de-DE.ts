/**
 * German translations for Sanity Plugin Inline Icon Manager
 * This file contains all German translations for the plugin
 */

export default {
  // AppStates
  'app-states.empty-state.select-icon': 'Icon auswählen',
  'app-states.filled-state.icon-customized': 'Icon wurde angepasst',

  // ButtonsBoard
  'buttons-board.tooltip.customize-icon': 'Icon anpassen',
  'buttons-board.tooltip.change-icon': 'Icon ändern',
  'buttons-board.tooltip.delete-icon': 'Icon löschen',

  // Dialogs
  // ConfigDialog
  'config-dialog.color.title': 'Farbe',
  'config-dialog.color.button.clear-color': 'Farbe löschen',
  'config-dialog.color.button.title': 'Farbe auf "currentColor" setzen',
  'config-dialog.color-picker.hex': 'HEX',
  'config-dialog.color-picker.rgba': 'RGBA',
  'config-dialog.footer.button.clear': 'Löschen',
  'config-dialog.footer.button.clear-configuration': 'Konfiguration löschen',
  'config-dialog.footer.button.save': 'Speichern',
  'config-dialog.footer.button.save-configuration': 'Konfiguration speichern',
  'config-dialog.header.title': 'Konfiguration',
  'config-dialog.inline-svg.title': 'Inline SVG',
  'config-dialog.preview.tooltip.content':
    'Vorschau auf 300x300 begrenzt, aber deine benutzerdefinierte Größe bleibt erhalten.',
  'config-dialog.preview.tooltip.text': 'Vorschau',

  // RemoveDialog
  'remove-dialog.button.cancel': 'Abbrechen',
  'remove-dialog.button.confirm': 'Bestätigen',
  'remove-dialog.dialog.text': 'Möchtest du das Icon wirklich entfernen?',

  // SearchDialog
  'search-dialog.header.title': 'Finde dein Icon',

  // Filters
  // FilterCollection
  'filter-collection.title': 'Sammlung',
  'filter-collection.select': 'Auswählen...',

  // FilterLimit
  'filte-limit.title': 'Limit',
  'filte-limit.min-max': 'min 32 / max 999',

  // FilterPalette
  'filter-palette.title': 'Palette',
  'filter-palette.select': 'Auswählen...',

  // FilterStyle
  'filter-style.title': 'Stil',
  'filter-style.select': 'Auswählen...',

  // IconManagerDiffComponent
  // IconDiffChangeList
  'icon-diff-change-list.button.hide-details': 'Details ausblenden',
  'icon-diff-change-list.button.show-details': 'Details anzeigen',

  // IconDiffWrapper
  'icon-diff-wrapper.icon-removed.removed': 'ENTFERNT',
  'icon-diff-wrapper.icon-added.empty': 'LEER',
  'icon-diff-wrapper.content': 'Unbenannt',

  // NoCollectionBadge
  'no-collection-badge.title': 'Keine verfügbaren Sammlungen.',
  'no-collection-badge.description': 'Überprüfe deine Plugin-Konfiguration.',

  // Pagination
  'pagination.total-items.icon_zero': 'Icon gefunden',
  'pagination.total-items.icon_one': 'Icon gefunden',
  'pagination.total-items.icon_other': 'Icons gefunden',

  // ResultsGrid
  'results-grid.no-icons-found': 'Keine Icons gefunden!',

  // SvgButtonsBoard
  'svg-buttons-board.tooltip.copy-html': 'SVG-HTML in die Zwischenablage kopieren',
  'svg-buttons-board.tooltip.copy-data-url': 'SVG-Data-URL in die Zwischenablage kopieren',

  // TabPanelAI
  // AIPromptInput
  'ai-prompt-input.error.prompt-required': 'Bitte gib eine Anfrage ein',
  'ai-prompt-input.error.ai-settings-required':
    'KI-Konfiguration nicht verfügbar. Bitte konfiguriere deine API-Schlüssel in den Einstellungen.',
  'ai-prompt-input.error.fail-submission': 'Fehler beim Generieren von Vorschlägen',
  'ai-prompt-input.api-key-configured':
    'KI-API-Schlüssel ist konfiguriert. Du kannst jetzt KI-gestützte Icon-Vorschläge nutzen.',
  'ai-prompt-input.api-key-not-configured':
    'KI-API-Schlüssel nicht konfiguriert. Du musst deinen API-Schlüssel konfigurieren, bevor du KI-Funktionen nutzen kannst.',
  'ai-prompt-input.describe-icon': 'Beschreibe das Icon, das du benötigst',
  'ai-prompt-input.prompt-placeholder':
    "Beschreibe das Icon (z.B. 'Ein Einkaufswagen für E-Commerce', 'Ein Einstellungsrad mit Benachrichtigungssymbol')",
  'ai-prompt-input.generate-icons':
    'KI generiert standardmäßig 6 Icon-Vorschläge (nur gültige Icons werden angezeigt). Um eine andere Anzahl anzufordern, füge "Generiere X Icon-Vorschläge" in deine Anfrage ein.',
  'ai-prompt-input.button.generate': 'Generieren',
  'ai-prompt-input.current-prompt': 'Aktuelle Anfrage',

  // AISuggestionCard
  'ai-suggestion-card.button.select-icon': 'Icon auswählen',

  // AISuggestionsGrid
  'ai-suggestions-grid.loading': 'Icon-Vorschläge werden generiert...',
  'ai-suggestions-grid.analyzing': 'Analysiere',
  'ai-suggestions-grid.error': 'Fehler beim Generieren von Vorschlägen',
  'ai-suggestions-grid.empty.title': 'KI-gestützte Icon-Vorschläge',
  'ai-suggestions-grid.empty.description':
    'Beschreibe, wonach du suchst, und die KI schlägt die relevantesten Icons aus beliebten Icon-Bibliotheken vor.',
  'ai-suggestions-grid.title': 'KI-Vorschläge',
  'ai-suggestions-grid.streaming': 'Streaming',

  // TabPanelCollection
  // CollectionsGrid
  'collections-grid.author-name': 'von {{authorName}}',

  // Step0
  'step-0.input-placeholder': 'Sammlungen filtern...',

  // Step1
  'step-1.author-name': 'von {{authorName}}',
  'step-1.input-placeholder': 'Icons filtern...',

  // TabPanelSearch
  // SearchInput
  'search-input.collection': 'Sammlung',
  'search-input.collection.all': 'Alle',
  'search-input.input-placeholder': 'Icons suchen...',
  'search-input.button-submit-text': 'Suchen',

  // Tabs
  'tabs.search': 'Suche',
  'tabs.collections': 'Sammlungen',
  'tabs.ai': 'KI-Vorschläge',

  // AISettingsDialog
  'ai-settings-dialog.toast.success.title': 'KI-Einstellungen gespeichert',
  'ai-settings-dialog.toast.success.description':
    'Deine KI-Konfiguration wurde erfolgreich aktualisiert',
  'ai-settings-dialog.toast.error.title': 'Speichern fehlgeschlagen',
  'ai-settings-dialog.toast.error.description':
    'Fehler beim Speichern der KI-Einstellungen. Bitte versuche es erneut.',
  'ai-settings-dialog.dialog-trigger-button': 'KI-API-Schlüssel konfigurieren',
  'ai-settings-dialog.dialog-header-title': 'KI-Einstellungen',
  'ai-settings-dialog.api-keys-title': 'API-Schlüssel',
  'ai-settings-dialog.no-providers': 'Keine KI-Anbieter konfiguriert',
  'ai-settings-dialog.provider-placeholder': 'Gib deinen {{providerKeyTitle}} ein',
  'ai-settings-dialog.button-save': 'Einstellungen speichern',

  // useSvgUtils
  'use-svg-utils.copy-to-clipboard': 'In die Zwischenablage kopieren',

  // Schemas
  // IconManager schema
  'icon-manager.schema.title': 'Icon',
}
