import {TrashIcon} from '@sanity/icons'
import {Box, Dialog, Flex} from '@sanity/ui'
import {useAppStore} from '../store'
import {StyledBaseButton} from './shared/ShartedStyledComponents'

interface RemoveDialogProps {}

const RemoveDialog = (props: RemoveDialogProps) => {
  const sanityValue = useAppStore((s) => s.sanityValue)
  const isRemoveDialogOpen = useAppStore((s) => s.isRemoveDialogOpen)
  const openRemoveDialog = useAppStore((s) => s.openRemoveDialog)
  const closeRemoveDialog = useAppStore((s) => s.closeRemoveDialog)
  const clearIcon = useAppStore((s) => s.clearIcon)

  if (!sanityValue) return null

  const DialogActions = () => (
    <Flex gap={2} justify='flex-end' margin={2}>
      <StyledBaseButton text='Confirm' tone='positive' fontSize={1} onClick={clearIcon} />
      <StyledBaseButton text='Cancel' tone='critical' fontSize={1} onClick={closeRemoveDialog} />
    </Flex>
  )

  return (
    <>
      <StyledBaseButton
        text='Clear icon'
        mode='bleed'
        tone='critical'
        icon={<TrashIcon width={18} />}
        fontSize={1}
        onClick={openRemoveDialog}
      />
      {isRemoveDialogOpen && (
        <Dialog id='remove-dialog' footer={<DialogActions />} width={0}>
          <Box margin={4}>Do you really want to remove the icon?</Box>
        </Dialog>
      )}
    </>
  )
}

export default RemoveDialog