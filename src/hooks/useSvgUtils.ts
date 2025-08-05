import { AppStoreTypePartial, generateSvgDataUrl, generateSvgHtml } from '../lib/svgUtils'
import { toastError, toastSuccess } from '../lib/toastUtils'
import { useAppStoreContext } from '../store/context'
import { useTranslation } from './useTranslation'

const useSvgUtils = () => {
  const { t } = useTranslation()
  const sanityValue = useAppStoreContext((s) => s.sanityValue)
  const color = useAppStoreContext((s) => s.color)
  const iconifyEndpoint = useAppStoreContext((s) => s.iconifyEndpoint)
  const sanityToast = useAppStoreContext((s) => s.sanityToast)

  const onGenerateSvgHtml = () => {
    return generateSvgHtml({
      sanityValue,
      color,
      iconifyEndpoint,
      sanityToast,
    })
  }

  const copy2Clipboard = async (text: string): Promise<boolean> => {
    try {
      await navigator.clipboard.writeText(text)
      toastSuccess({ sanityToast, title: t('use-svg-utils.copy-to-clipboard') })
      return true
    } catch (e: unknown) {
      toastError(sanityToast, e)
      return false
    }
  }

  const copyHtmlToClipboard = async (appState: AppStoreTypePartial): Promise<void> => {
    const html = await generateSvgHtml(appState)
    if (html) copy2Clipboard(html)
  }

  const copyDataUrlToClipboard = async (appState: AppStoreTypePartial): Promise<void> => {
    const dataUrl = await generateSvgDataUrl(appState)
    if (dataUrl) copy2Clipboard(dataUrl)
  }

  const onCopyHtmlToClipboard = () => {
    copyHtmlToClipboard({ sanityValue, color, iconifyEndpoint, sanityToast })
  }

  const onCopyDataUrlToClipboard = () => {
    copyDataUrlToClipboard({ sanityValue, color, iconifyEndpoint, sanityToast })
  }

  return {
    onGenerateSvgHtml,
    onCopyHtmlToClipboard,
    onCopyDataUrlToClipboard,
  }
}

export default useSvgUtils
