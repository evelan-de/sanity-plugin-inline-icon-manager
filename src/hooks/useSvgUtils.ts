import { copyDataUrlToClipboard, copyHtmlToClipboard } from '../lib/clipboardUtils'
import { generateSvgHtml } from '../lib/svgUtils'
import { useAppStoreContext } from '../store/context'

const useSvgUtils = () => {
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
