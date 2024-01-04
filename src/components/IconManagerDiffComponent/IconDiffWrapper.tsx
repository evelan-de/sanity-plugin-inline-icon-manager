import { DocumentIcon } from '@sanity/icons'
import { Badge, Box, Flex, Text } from '@sanity/ui'
import { DiffCard, DiffProps, DiffTooltip, ObjectDiff, useTranslation } from 'sanity'

import { IconManagerType } from '../../types/IconManagerType'
import IconPreview from '../IconPreview'

const IconDiffWrapper = (props: DiffProps<ObjectDiff<IconManagerType>>) => {
  const { fromValue, toValue, action } = props.diff
  const { t } = useTranslation('sanity-plugin-inline-icon-manager')

  // CASE 1: icon unchanged
  if (action === 'unchanged' && fromValue.icon) {
    return (
      <Flex justify='center' style={{ margin: '10px auto' }}>
        <IconPreview value={fromValue} />
      </Flex>
    )
  }
  // CASE 2: icon changed
  if (action === 'changed' && fromValue.icon && toValue.icon) {
    return (
      <Box style={{ margin: '10px auto' }}>
        <Flex align='center' gap={5}>
          <IconPreview value={fromValue} /> → <IconPreview value={toValue} />
        </Flex>
      </Box>
    )
  }
  // CASE 3: icon removed
  if (action === 'removed' && fromValue.icon && !toValue) {
    return (
      <Box style={{ margin: '10px auto' }}>
        <Flex align='center' gap={5}>
          <IconPreview value={fromValue} /> →{' '}
          <Badge tone='critical' size={1}>
            {t('icon-manager.diff.tooltip.removed.text')}
          </Badge>
        </Flex>
      </Box>
    )
  }
  // CASE 4: icon added
  if (action === 'added' && toValue.icon) {
    return (
      <Box style={{ margin: '10px auto' }}>
        <Flex align='center' gap={5}>
          <Badge tone='primary' size={1}>
            {t('icon-manager.diff.tooltip.empty.text')}
          </Badge>{' '}
          → <IconPreview value={toValue} />
        </Flex>
      </Box>
    )
  }

  return (
    <DiffTooltip diff={props.diff}>
      <DiffCard diff={props.diff}>
        <Box padding={2}>
          <Flex align='center' gap={3}>
            <DocumentIcon fontSize={32} />
            <Text muted size={2}>
              {t('icon-manager.diff.tooltip.untitled.text')}
            </Text>
          </Flex>
        </Box>
      </DiffCard>
    </DiffTooltip>
  )
}

export default IconDiffWrapper
