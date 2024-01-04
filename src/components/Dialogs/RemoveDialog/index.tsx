import { HelpCircleIcon } from '@sanity/icons'
import { Box, Dialog, Text } from '@sanity/ui'
import { useTranslation } from 'sanity'

import { useAppStoreContext } from '../../../store/context'
import Footer from './Footer'

interface RemoveDialogProps {}

const RemoveDialog = (props: RemoveDialogProps) => {
  const { t } = useTranslation('sanity-plugin-inline-icon-manager')
  const sanityValue = useAppStoreContext((s) => s.sanityValue)
  const isRemoveDialogOpen = useAppStoreContext((s) => s.isRemoveDialogOpen)

  if (!sanityValue?.icon || !isRemoveDialogOpen) return null

  return (
    <Dialog id='remove-dialog' header={<HelpCircleIcon />} footer={<Footer />} width={0}>
      <Box marginX={4} marginY={5}>
        <Text size={2}>{t('remove-dialog.footer.button.confirm.title')}</Text>
      </Box>
    </Dialog>
  )
}

export default RemoveDialog
