import { Flex } from '@sanity/ui'
import { useTranslation } from 'sanity'

import IconifySmile from '../../icons/IconifySmile'

const Header = () => {
  const { t } = useTranslation('sanity-plugin-inline-icon-manager')

  return (
    <Flex align='center' gap={2}>
      <IconifySmile /> {t('search-dialog.header.text')}
    </Flex>
  )
}
export default Header
