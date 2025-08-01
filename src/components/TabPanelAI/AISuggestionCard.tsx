import { Button, Card, Flex, Text } from '@sanity/ui'
import { useCallback } from 'react'

import IconPreview from '../../components/IconPreview'
import { useAppStoreContext } from '../../store/context'
import { AISuggestion } from '../../store/Slices/AISlice'

interface AISuggestionCardProps {
  suggestion: AISuggestion
}

const AISuggestionCard = ({ suggestion }: AISuggestionCardProps) => {
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
        <Flex justify='center' align='center' style={{ minHeight: '48px' }}>
          <div
            style={{
              fontSize: '32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <IconPreview
              icon={`${suggestion.setPrefix}:${suggestion.name}`}
              width={32}
              height={32}
            />
          </div>
        </Flex>

        {/* Icon Info */}
        <Flex direction='column' gap={3}>
          <Text size={2} weight='semibold' align='center'>
            {suggestion.iconName}
          </Text>

          <Text size={2}>{suggestion.iconProviderDisplayName}</Text>

          <Text size={1} muted style={{ lineHeight: 1.4 }}>
            {suggestion.reasoning}
          </Text>
        </Flex>

        {/* Select Button */}
        <Button
          text='Select Icon'
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
