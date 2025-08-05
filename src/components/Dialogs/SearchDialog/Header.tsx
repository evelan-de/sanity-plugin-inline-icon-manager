import { Flex } from '@sanity/ui'

import { useTranslation } from '../../../hooks/useTranslation'
import IconifySmile from '../../icons/IconifySmile'

const Header = () => {
  const { t } = useTranslation()

  return (
    <Flex align='center' gap={2}>
      <IconifySmile /> {t('search-dialog.header.title')}
    </Flex>
  )
}

export default Header
