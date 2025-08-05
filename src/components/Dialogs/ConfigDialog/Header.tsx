import { CogIcon } from '@sanity/icons'
import { Flex } from '@sanity/ui'

import { useTranslation } from '../../../hooks/useTranslation'

const Header = () => {
  const { t } = useTranslation()

  return (
    <Flex align='center' gap={3}>
      <CogIcon />
      <span>{t('config-dialog.header.title')}</span>
    </Flex>
  )
}

export default Header
