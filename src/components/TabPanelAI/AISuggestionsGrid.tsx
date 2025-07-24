import { Box, Card, Flex, Grid, Spinner, Text } from '@sanity/ui'

import { useAppStoreContext } from '../../store/context'
import AISuggestionCard from './AISuggestionCard'

const AISuggestionsGrid = () => {
  const aiSuggestions = useAppStoreContext((s) => s.aiSuggestions)
  const isAILoading = useAppStoreContext((s) => s.isAILoading)
  const isStreaming = useAppStoreContext((s) => s.isStreaming)
  const aiError = useAppStoreContext((s) => s.aiError)
  const aiPrompt = useAppStoreContext((s) => s.aiPrompt)

  // Show loading state
  if (isAILoading && aiSuggestions.length === 0) {
    return (
      <Card padding={6} radius={2}>
        <Flex direction='column' align='center' gap={3}>
          <Spinner muted />
          <Text size={2} muted align='center'>
            Generating icon suggestions...
          </Text>
          {aiPrompt && (
            <Text size={1} muted align='center'>
              Analyzing: &quot;{aiPrompt}&quot;
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
            Error generating suggestions
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
            AI-Powered Icon Suggestions
          </Text>
          <Text size={1} muted align='center' style={{ maxWidth: '400px' }}>
            Describe what you&apos;re looking for and AI will suggest the most relevant icons from
            popular icon libraries.
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
              AI Suggestions ({aiSuggestions.length})
            </Text>
            {isStreaming && (
              <Flex align='center' gap={2}>
                <Spinner size={1} />
                <Text size={1} muted>
                  Generating more...
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
