import { SearchIcon } from '@sanity/icons'
import { Box, Button, Card, Flex, Select, Text, TextArea } from '@sanity/ui'
import { useCallback, useMemo, useState } from 'react'

import { useAISettings, useAvailableModels } from '../../hooks/useAISettings'
import { useTranslation } from '../../hooks/useTranslation'
import { aiIconService } from '../../services/ai-service'
import { useAppStoreContext } from '../../store/context'
import { AISuggestion } from '../../store/Slices/AISlice'
import AISettingsDialog from '../AISettingsDialog'

const AIPromptInput = () => {
  const [localPrompt, setLocalPrompt] = useState('')
  const { t } = useTranslation()

  const aiPrompt = useAppStoreContext((s) => s.aiPrompt)
  const isAILoading = useAppStoreContext((s) => s.isAILoading)
  const isStreaming = useAppStoreContext((s) => s.isStreaming)
  const selectedModel = useAppStoreContext((s) => s.selectedModel)
  const iconifyEndpoint = useAppStoreContext((s) => s.iconifyEndpoint)
  const setAIPrompt = useAppStoreContext((s) => s.setAIPrompt)
  const setAISuggestions = useAppStoreContext((s) => s.setAISuggestions)
  const setAILoading = useAppStoreContext((s) => s.setAILoading)
  const setAIError = useAppStoreContext((s) => s.setAIError)
  const setStreaming = useAppStoreContext((s) => s.setStreaming)
  const setSelectedModel = useAppStoreContext((s) => s.setSelectedModel)
  const clearAISuggestions = useAppStoreContext((s) => s.clearAISuggestions)
  const aiSecretsNamespace = useAppStoreContext((s) => s.aiSecretsNamespace)
  const hasCustomSecretsNamespace = useAppStoreContext((s) => s.hasCustomSecretsNamespace)

  // Get available models from configured providers
  const availableModels = useAvailableModels(aiSecretsNamespace || undefined)

  const modelsByProvider = useMemo(() => {
    return availableModels.reduce(
      (acc, model) => {
        if (!acc[model.providerName]) {
          acc[model.providerName] = []
        }
        acc[model.providerName].push(model)
        return acc
      },
      {} as Record<string, typeof availableModels>,
    )
  }, [availableModels])

  // Convert selectedModel string to AIModelChoiceType object
  const selectedModelObject = useMemo(() => {
    if (!selectedModel || typeof selectedModel === 'object') {
      return selectedModel as any
    }

    // Find the model in availableModels to get the correct keyName
    const modelInfo = availableModels.find((m) => m.model === selectedModel)
    if (modelInfo) {
      return {
        model: modelInfo.model,
        keyName: modelInfo.keyName,
      }
    }

    return undefined
  }, [selectedModel, availableModels])

  // Use dynamic AI settings based on configuration
  const aiSettings = useAISettings({
    model: selectedModelObject,
    namespace: aiSecretsNamespace || undefined,
  })

  const handleSubmit = useCallback(
    async (event: React.FormEvent) => {
      event.preventDefault()

      if (!localPrompt.trim()) {
        setAIError(t('ai-prompt-input.error.prompt-required'))
        return
      }

      // Check if AI configuration is available
      if (aiSettings.error || !aiSettings.engine) {
        setAIError(t('ai-prompt-input.error.ai-settings-required'))
        return
      }

      setAIPrompt(localPrompt)
      setAILoading(true)
      setStreaming(true)
      clearAISuggestions()

      const suggestions: AISuggestion[] = []

      try {
        const stream = aiIconService.streamIconSuggestions(
          localPrompt,
          aiSettings.engine, // Use dynamic engine configuration
          iconifyEndpoint,
        )

        for await (const partialSuggestions of stream) {
          // Skip if no suggestions
          if (!partialSuggestions || partialSuggestions.length === 0) {
            continue
          }

          suggestions.push(...partialSuggestions)

          // Update state to trigger UI refresh
          setAISuggestions([...suggestions])
        }

        setStreaming(false)
        setAILoading(false)
      } catch (error) {
        console.error('Error generating suggestions:', error)
        setAIError(
          error instanceof Error ? error.message : t('ai-prompt-input.error.fail-submission'),
        )
        setStreaming(false)
        setAILoading(false)
      }
    },
    [
      localPrompt,
      aiSettings,
      iconifyEndpoint,
      setAIPrompt,
      setAILoading,
      setAIError,
      setStreaming,
      clearAISuggestions,
      setAISuggestions,
      t,
    ],
  )

  const handleInputChange = useCallback(
    (event: React.ChangeEvent<HTMLTextAreaElement>) => {
      setLocalPrompt(event.currentTarget.value)
    },
    [setLocalPrompt],
  )

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault()
        handleSubmit(event as any)
      }
    },
    [handleSubmit],
  )

  const handleModelChange = useCallback(
    (event: React.ChangeEvent<HTMLSelectElement>) => {
      setSelectedModel(event.currentTarget.value as any)
    },
    [setSelectedModel],
  )

  const hasApiKey = Boolean(aiSettings?.engine?.apiKey)
  const isDisabled = isAILoading || isStreaming || !hasApiKey

  return (
    <Card padding={4} radius={2} shadow={1} marginTop={4}>
      <Flex direction='column' gap={3}>
        {!hasCustomSecretsNamespace && (
          <Card tone={hasApiKey ? 'positive' : 'caution'} padding={3} radius={2}>
            <Flex align='center' justify='space-between' gap={3}>
              <Text size={1}>
                {hasApiKey
                  ? t('ai-prompt-input.api-key-configured')
                  : t('ai-prompt-input.api-key-not-configured')}
              </Text>
              <AISettingsDialog namespace={aiSecretsNamespace || undefined} />
            </Flex>
          </Card>
        )}
        <Text size={1} weight='medium'>
          {t('ai-prompt-input.describe-icon')}
        </Text>
        <TextArea
          placeholder={t('ai-prompt-input.prompt-placeholder')}
          value={localPrompt}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          disabled={isDisabled}
          style={{ flex: 1 }}
        />
        <Text size={0} muted>
          {t('ai-prompt-input.generate-icons')}
        </Text>
        <Flex justify='space-between' align='center' gap={3}>
          <Button
            icon={SearchIcon}
            text={t('ai-prompt-input.button.generate')}
            tone='primary'
            onClick={handleSubmit}
            disabled={isDisabled || !localPrompt.trim() || !hasApiKey}
            loading={isAILoading}
            style={{ width: 'fit-content' }}
          />
          <Box style={{ width: 'fit-content', maxWidth: '250px' }}>
            <Select value={selectedModel} onChange={handleModelChange} disabled={isDisabled}>
              {Object.entries(modelsByProvider).map(([providerName, models]) => (
                <optgroup key={providerName} label={providerName}>
                  {models.map((model) => (
                    <option key={`${model.providerName}-${model.model}`} value={model.model}>
                      {model.model}
                    </option>
                  ))}
                </optgroup>
              ))}
            </Select>
          </Box>
        </Flex>
        {aiPrompt && (
          <Text size={1} muted>
            {t('ai-prompt-input.current-prompt')}: &quot;{aiPrompt}&quot;
          </Text>
        )}
      </Flex>
    </Card>
  )
}

export default AIPromptInput
