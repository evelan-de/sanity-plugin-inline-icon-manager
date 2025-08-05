import { Button, Flex } from '@sanity/ui'

import useSvgUtils from '../../../hooks/useSvgUtils'
import { useTranslation } from '../../../hooks/useTranslation'
import { useAppStoreContext } from '../../../store/context'
import SvgButtonsBoard from '../../SvgButtonsBoard'

const Footer = () => {
  const { onCopyHtmlToClipboard, onCopyDataUrlToClipboard } = useSvgUtils()
  const clearConfiguration = useAppStoreContext((s) => s.clearConfiguration)
  const saveConfiguration = useAppStoreContext((s) => s.saveConfiguration)
  const { t } = useTranslation()

  return (
    <Flex
      direction={['column', 'column', 'column', 'row']}
      margin={2}
      align={'center'}
      justify='space-between'
      gap={2}
    >
      <Flex align='center' gap={2}>
        <SvgButtonsBoard
          onCopyHtmlToClipboard={onCopyHtmlToClipboard}
          onCopyDataUrlToClipboard={onCopyDataUrlToClipboard}
        />
      </Flex>
      <Flex align='center' gap={2}>
        <Button
          text={t('config-dialog.footer.button.clear')}
          title={t('config-dialog.footer.button.clear-configuration')}
          mode='bleed'
          tone='critical'
          fontSize={2}
          style={{ cursor: 'pointer' }}
          onClick={clearConfiguration}
        />
        <Button
          text={t('config-dialog.footer.button.save')}
          title={t('config-dialog.footer.button.save-configuration')}
          mode='bleed'
          tone='positive'
          fontSize={2}
          style={{ cursor: 'pointer' }}
          onClick={saveConfiguration}
        />
      </Flex>
    </Flex>
  )
}

export default Footer
