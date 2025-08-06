import { Button, Flex } from '@sanity/ui'

import { useTranslation } from '../../../hooks/useTranslation'
import { useAppStoreContext } from '../../../store/context'

const Footer = () => {
  const closeRemoveDialog = useAppStoreContext((s) => s.closeRemoveDialog)
  const removeIcon = useAppStoreContext((s) => s.removeIcon)
  const { t } = useTranslation()

  return (
    <Flex gap={2} justify='flex-end' margin={2}>
      <Button
        text={t('remove-dialog.button.cancel')}
        mode='bleed'
        tone='critical'
        fontSize={2}
        style={{ cursor: 'pointer' }}
        onClick={closeRemoveDialog}
      />
      <Button
        text={t('remove-dialog.button.confirm')}
        mode='bleed'
        tone='positive'
        fontSize={2}
        style={{ cursor: 'pointer' }}
        onClick={removeIcon}
      />
    </Flex>
  )
}

export default Footer
