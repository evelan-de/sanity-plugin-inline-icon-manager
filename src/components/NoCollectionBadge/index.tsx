import { Badge, Flex } from '@sanity/ui'

import { useTranslation } from '../../hooks/useTranslation'

export default function NoCollectionBadge() {
  const { t } = useTranslation()

  return (
    <Flex marginY={4} justify='center'>
      <Badge
        mode='outline'
        tone='critical'
        margin={4}
        padding={4}
        flex={1}
        style={{ textAlign: 'center' }}
        radius={0}
      >
        {t('no-collection-badge.title')}
        <br />
        {t('no-collection-badge.description')}
      </Badge>
    </Flex>
  )
}
