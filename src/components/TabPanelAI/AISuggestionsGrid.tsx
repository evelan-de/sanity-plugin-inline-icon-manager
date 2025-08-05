import { Box, Card, Flex, Grid, Spinner, Text } from '@sanity/ui'

import { useTranslation } from '../../hooks/useTranslation'
import { useAppStoreContext } from '../../store/context'
import AISuggestionCard from './AISuggestionCard'

const AISuggestionsGrid = () => {
  const aiSuggestions = useAppStoreContext((s) => s.aiSuggestions)
  const isAILoading = useAppStoreContext((s) => s.isAILoading)
  const isStreaming = useAppStoreContext((s) => s.isStreaming)
  const aiError = useAppStoreContext((s) => s.aiError)
  const aiPrompt = useAppStoreContext((s) => s.aiPrompt)

  const { t } = useTranslation()

  // Show loading state
  if (isAILoading && aiSuggestions.length === 0) {
    return (
      <Card padding={6} radius={2}>
        <Flex direction='column' align='center' gap={3}>
          <Spinner muted />
          <Text size={2} muted align='center'>
            {t('ai-suggestions-grid.loading')}
          </Text>
          {aiPrompt && (
            <Text size={1} muted align='center'>
              {t('ai-suggestions-grid.analyzing')}: &quot;{aiPrompt}&quot;
            </Text>
          )}
        </Flex>
      </Card>
    )
  }

  // Show error state
  if (aiError) {
    return (
      <Card padding={4} radius={2} tone='critical'>
        <Flex direction='column' gap={2}>
          <Text size={2} weight='semibold'>
            {t('ai-suggestions-grid.error')}
          </Text>
          <Text size={1} muted>
            {aiError}
          </Text>
        </Flex>
      </Card>
    )
  }

  // Show empty state when no prompt has been entered
  if (!aiPrompt && aiSuggestions.length === 0) {
    return (
      <Card padding={6} radius={2} tone='transparent'>
        <Flex direction='column' align='center' gap={3}>
          <Text size={3}>✨</Text>
          <Text size={2} weight='semibold' align='center'>
            {t('ai-suggestions-grid.empty.title')}
          </Text>
          <Text size={1} muted align='center' style={{ maxWidth: '400px' }}>
            {t('ai-suggestions-grid.empty.description')}
          </Text>
        </Flex>
      </Card>
    )
  }

  // Show suggestions grid
  if (aiSuggestions.length > 0) {
    return (
      <Box padding={4}>
        <Flex direction='column' gap={4}>
          {/* Header with streaming indicator */}
          <Flex justify='space-between' align='center'>
            <Text size={2} weight='semibold'>
              {t('ai-suggestions-grid.title')} ({aiSuggestions.length})
            </Text>
            {isStreaming && (
              <Flex align='center' gap={2}>
                <Spinner size={1} />
                <Text size={1} muted>
                  {t('ai-suggestions-grid.streaming')}
                </Text>
              </Flex>
            )}
          </Flex>

          {/* Grid of suggestion cards */}
          <Grid columns={[1, 2, 3]} gap={3}>
            {aiSuggestions.map((suggestion) => (
              <AISuggestionCard
                key={`${suggestion.setPrefix}-${suggestion.name}`}
                suggestion={suggestion}
              />
            ))}
          </Grid>
        </Flex>
      </Box>
    )
  }

  return null
}

export default AISuggestionsGrid
