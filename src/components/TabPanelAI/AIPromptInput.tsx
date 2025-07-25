import { CogIcon, SearchIcon } from '@sanity/icons'
import { Box, Button, Card, Flex, Select, Text, TextArea } from '@sanity/ui'
import { useCallback, useState } from 'react'

import { useAISecrets } from '../../hooks/useAISecrets'
import { aiIconService } from '../../services/ai-service'
import { useAppStoreContext } from '../../store/context'
import { AI_MODELS, AISuggestion } from '../../store/Slices/AISlice'
import AISettings from './AISettings'

const AIPromptInput = () => {
  const [localPrompt, setLocalPrompt] = useState('')
  const [showSettings, setShowSettings] = useState(false)

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

  const { secrets } = useAISecrets()

  const handleOpenSettings = useCallback(() => {
    setShowSettings(true)
  }, [])

  const handleCloseSettings = useCallback(() => {
    setShowSettings(false)
  }, [])

  const handleSubmit = useCallback(async () => {
    if (!localPrompt.trim()) return

    try {
      setAIPrompt(localPrompt)
      setAILoading(true)
      setStreaming(true)
      clearAISuggestions()

      // Check if API key is configured
      if (!secrets?.openaiApiKey) {
        setShowSettings(true)
        setAIError('OpenAI API key not configured. Please configure it in the settings.')
        return
      }

      // Use streaming for better UX
      const suggestions: AISuggestion[] = []

      try {
        const stream = aiIconService.streamIconSuggestions(
          localPrompt,
          secrets.openaiApiKey,
          selectedModel,
          iconifyEndpoint,
        )

        for await (const partialSuggestions of stream) {
          // Skip if no suggestions
          if (!partialSuggestions || partialSuggestions.length === 0) continue

          suggestions.push(...partialSuggestions)

          // Update state to trigger UI refresh
          setAISuggestions([...suggestions])
        }
      } catch (streamError) {
        console.error('Streaming failed, error details:', streamError)
        throw streamError
      }

      setStreaming(false)
      setAILoading(false)
    } catch (error) {
      console.error('Error generating suggestions:', error)
      setAIError(error instanceof Error ? error.message : 'Failed to generate suggestions')
      setStreaming(false)
      setAILoading(false)
    }
  }, [
    localPrompt,
    selectedModel,
    iconifyEndpoint,
    setAIPrompt,
    setAILoading,
    setStreaming,
    clearAISuggestions,
    secrets?.openaiApiKey,
    setShowSettings,
    setAIError,
    setAISuggestions,
  ])

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
        handleSubmit()
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

  const hasApiKey = Boolean(secrets?.openaiApiKey)
  const isDisabled = isAILoading || isStreaming || !hasApiKey

  return (
    <Card padding={4} radius={2} shadow={1} marginTop={4}>
      {showSettings && <AISettings onClose={handleCloseSettings} />}

      <Flex direction='column' gap={3}>
        <Card tone={hasApiKey ? 'positive' : 'caution'} padding={3} radius={2}>
          <Flex align='center' gap={3}>
            <Text size={1}>
              {hasApiKey
                ? 'OpenAI API key is configured. You can now use AI-powered icon suggestions.'
                : 'OpenAI API key not configured. You need to configure your API key before using AI features.'}
            </Text>
            <Button
              icon={CogIcon}
              text={hasApiKey ? 'Manage API Key' : 'Configure API Key'}
              onClick={handleOpenSettings}
              tone='primary'
              mode='ghost'
            />
          </Flex>
        </Card>
        <Text size={1} weight='medium'>
          Describe the icon you need
        </Text>
        <TextArea
          placeholder="Describe the icon (e.g., 'A shopping cart for e-commerce', 'A settings gear with notification badge')"
          value={localPrompt}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          disabled={isDisabled}
          style={{ flex: 1 }}
        />
        <Text size={0} muted>
          The AI will attempt to generate 6 icons by default (only valid icons will be shown). You
          can request a specific number by saying &quot;Generate X icon suggestions&quot; in your
          prompt.
        </Text>
        <Flex justify='space-between' align='center' gap={3}>
          <Button
            icon={SearchIcon}
            text='Generate'
            tone='primary'
            onClick={handleSubmit}
            disabled={isDisabled || !localPrompt.trim() || !hasApiKey}
            loading={isAILoading}
            style={{ width: 'fit-content' }}
          />
          <Box style={{ width: 'fit-content', maxWidth: '250px' }}>
            <Select value={selectedModel} onChange={handleModelChange} disabled={isDisabled}>
              {AI_MODELS.map((model) => (
                <option key={model.value} value={model.value}>
                  {model.label}
                </option>
              ))}
            </Select>
          </Box>
        </Flex>
        {aiPrompt && (
          <Text size={1} muted>
            Current prompt: &quot;{aiPrompt}&quot;
          </Text>
        )}
      </Flex>
    </Card>
  )
}

export default AIPromptInput
