import { Button, Card, Flex, Text } from '@sanity/ui'
import { useCallback } from 'react'

import IconPreview from '../../components/IconPreview'
import { useTranslation } from '../../hooks/useTranslation'
import { useAppStoreContext } from '../../store/context'
import { AISuggestion } from '../../store/Slices/AISlice'

interface AISuggestionCardProps {
  suggestion: AISuggestion
}

const AISuggestionCard = ({ suggestion }: AISuggestionCardProps) => {
  const { t } = useTranslation()
  const saveIcon = useAppStoreContext((s) => s.saveIcon)
  const closeSearchDialog = useAppStoreContext((s) => s.closeSearchDialog)

  const handleSelectIcon = useCallback(() => {
    // Create an icon object that matches the IconManagerIconInfo format
    // The icon field should be a string identifier
    const iconData = {
      icon: `${suggestion.setPrefix}:${suggestion.name}`,
    }

    saveIcon(iconData)
    closeSearchDialog()
  }, [suggestion.setPrefix, suggestion.name, saveIcon, closeSearchDialog])

  return (
    <Card padding={3} radius={2} shadow={1} tone='default'>
      <Flex direction='column' gap={3} style={{ height: '100%' }}>
        {/* Icon Preview */}
        <Flex justify='center' align='center' style={{ minHeight: '64px' }}>
          <div
            style={{
              fontSize: '64px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <IconPreview
              icon={`${suggestion.setPrefix}:${suggestion.name}`}
              width={64}
              height={64}
            />
          </div>
        </Flex>

        {/* Icon Info */}
        <Flex direction='column' gap={3}>
          <Text size={2} weight='semibold' align='center'>
            {suggestion.iconName}
          </Text>

          <Text size={1} style={{ marginTop: '8px' }}>
            {suggestion.iconProviderDisplayName}
          </Text>

          <Text size={1} muted style={{ lineHeight: 1.4 }}>
            {suggestion.reasoning}
          </Text>
        </Flex>

        {/* Select Button */}
        <Button
          text={t('ai-suggestion-card.button.select-icon')}
          tone='primary'
          mode='default'
          onClick={handleSelectIcon}
          style={{ width: '100%', marginTop: 'auto' }}
        />
      </Flex>
    </Card>
  )
}

export default AISuggestionCard
