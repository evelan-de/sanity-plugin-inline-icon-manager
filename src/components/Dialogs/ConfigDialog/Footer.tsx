import { Button, Flex } from '@sanity/ui'
import { useTranslation } from 'sanity'

import useSvgUtils from '../../../hooks/useSvgUtils'
import { useAppStoreContext } from '../../../store/context'
import SvgButtonsBoard from '../../SvgButtonsBoard'

const Footer = () => {
  const { t } = useTranslation('sanity-plugin-inline-icon-manager')
  const { onGenerateSvgDownloadUrl, onCopyHtmlToClipboard, onCopyDataUrlToClipboard } =
    useSvgUtils()
  const downloadableUrl = useAppStoreContext(() => onGenerateSvgDownloadUrl())
  const clearConfiguration = useAppStoreContext((s) => s.clearConfiguration)
  const saveConfiguration = useAppStoreContext((s) => s.saveConfiguration)
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
          downloadUrl={downloadableUrl}
          onCopyHtmlToClipboard={onCopyHtmlToClipboard}
          onCopyDataUrlToClipboard={onCopyDataUrlToClipboard}
        />
      </Flex>
      <Flex align='center' gap={2}>
        <Button
          text={t('config-dialog.footer.button.clear.text')}
          title={t('config-dialog.footer.button.clear.title')}
          mode='bleed'
          tone='critical'
          fontSize={2}
          style={{ cursor: 'pointer' }}
          onClick={clearConfiguration}
        />
        <Button
          text={t('config-dialog.footer.button.save.text')}
          title={t('config-dialog.footer.button.save.title')}
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
