import { HelpCircleIcon } from '@sanity/icons'
import { Box, Dialog, Text } from '@sanity/ui'

import { useTranslation } from '../../../hooks/useTranslation'
import { useAppStoreContext } from '../../../store/context'
import Footer from './Footer'

const RemoveDialog = () => {
  const sanityValue = useAppStoreContext((s) => s.sanityValue)
  const isRemoveDialogOpen = useAppStoreContext((s) => s.isRemoveDialogOpen)
  const { t } = useTranslation()

  if (!sanityValue?.icon || !isRemoveDialogOpen) return null

  return (
    <Dialog id='remove-dialog' header={<HelpCircleIcon />} footer={<Footer />} width={0}>
      <Box marginX={4} marginY={5}>
        <Text size={2}>{t('remove-dialog.dialog.text')}</Text>
      </Box>
    </Dialog>
  )
}

export default RemoveDialog
