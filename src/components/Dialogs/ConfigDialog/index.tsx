/* eslint-disable react/jsx-no-bind */
import { Card, Dialog, Flex } from '@sanity/ui'

import { useAppStoreContext } from '../../../store/context'
import Color from './Color'
import Footer from './Footer'
import Header from './Header'
import InlineSvg from './InlineSvg'
import Preview from './Preview'

const ConfigDialog = () => {
  const isConfigDialogOpen = useAppStoreContext((s) => s.isConfigDialogOpen)
  const closeConfigDialog = useAppStoreContext((s) => s.closeConfigDialog)
  const storeInlineSvg = useAppStoreContext((s) => s.storeInlineSvg)

  if (!isConfigDialogOpen) return null

  return (
    <Dialog
      id='config-dialog'
      header={<Header />}
      footer={<Footer />}
      onClose={closeConfigDialog}
      width={1}
    >
      <Card marginY={4} marginX={[4, 4, 6, 7]}>
        <Flex direction='column' gap={4}>
          {storeInlineSvg ? null : <InlineSvg />}
          <Color />
        </Flex>
        <Preview />
      </Card>
    </Dialog>
  )
}

export default ConfigDialog
