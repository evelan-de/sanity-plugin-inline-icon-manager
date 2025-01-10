import { Icon } from '@iconify/react'
import { Flex } from '@sanity/ui'

import { IconManagerType } from '../../types/IconManagerType'

interface IconPreviewProps {
  value?: IconManagerType
  icon?: string
  width?: string | number
  height?: string | number
}

const IconPreview = ({ icon, value, width = 50, height = 50 }: IconPreviewProps) => {
  if (icon)
    return (
      <Icon
        icon={icon}
        width={width}
        height={height}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      />
    )

  if (!value?.icon) return null

  const {
    metadata: { color },
  } = value

  return (
    <Flex direction='column' align='center' justify='center' gap={2}>
      <Icon
        icon={value.icon}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          ...(color?.hex && { color: color.hex }),
        }}
        width={width}
        height={height}
      />
    </Flex>
  )
}

export default IconPreview
