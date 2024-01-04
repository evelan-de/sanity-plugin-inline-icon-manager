import { Button, Flex } from '@sanity/ui'
import { useTranslation } from 'sanity'

import { useAppStoreContext } from '../../../store/context'

const Footer = () => {
  const { t } = useTranslation('sanity-plugin-inline-icon-manager')
  const closeRemoveDialog = useAppStoreContext((s) => s.closeRemoveDialog)
  const removeIcon = useAppStoreContext((s) => s.removeIcon)

  return (
    <Flex gap={2} justify='flex-end' margin={2}>
      <Button
        text={t('remove-dialog.button.cancel.text')}
        mode='bleed'
        tone='critical'
        fontSize={2}
        style={{ cursor: 'pointer' }}
        onClick={closeRemoveDialog}
      />
      <Button
        text={t('remove-dialog.button.remove.text')}
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
