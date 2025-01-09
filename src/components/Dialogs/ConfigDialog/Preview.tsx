import { Icon } from '@iconify/react'
import { InfoOutlineIcon } from '@sanity/icons'
import { Card, Flex, Text, Tooltip, useTheme } from '@sanity/ui'

import { useAppStoreContext } from '../../../store/context'

const PREVIEW_SIZE_LIMIT = 300

const Preview = () => {
  const theme = useTheme()
  const sanityValue = useAppStoreContext((s) => s.sanityValue)
  const previewBorder = useAppStoreContext((s) => s.previewBorder)
  const color = useAppStoreContext((s) => s.color)

  if (!sanityValue) return null

  return (
    <Card marginTop={5}>
      <Tooltip
        content={
          <Text size={0} style={{ padding: '5px' }}>
            Preview limited to 300x300, but your custom size is preserved.
          </Text>
        }
        fallbackPlacements={['right', 'left']}
        placement='top'
        portal
      >
        <Text
          size={1}
          weight='bold'
          style={{
            display: 'inline-flex',
            alignItems: 'center',
          }}
        >
          <InfoOutlineIcon />
          &nbsp;&nbsp;Preview:
        </Text>
      </Tooltip>

      <Flex align='center' justify='center' paddingY={5} paddingX={2}>
        <Card
          tone={previewBorder ? 'positive' : 'default'}
          border
          style={{ overflow: 'hidden', borderColor: 'transparent' }}
        >
          <Icon
            icon={sanityValue.icon}
            style={{ display: 'block', ...(color?.hex && { color: color.hex }) }}
          />
        </Card>
      </Flex>
    </Card>
  )
}

export default Preview
