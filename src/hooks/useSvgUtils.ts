import { copyDataUrlToClipboard, copyHtmlToClipboard } from '../lib/clipboardUtils'
import { generateSvgHtml } from '../lib/svgUtils'
import { useAppStoreContext } from '../store/context'

const useSvgUtils = () => {
  const sanityValue = useAppStoreContext((s) => s.sanityValue)
  const rotate = useAppStoreContext((s) => s.rotate)
  const size = useAppStoreContext((s) => s.size)
  const color = useAppStoreContext((s) => s.color)
  const iconifyEndpoint = useAppStoreContext((s) => s.iconifyEndpoint)
  const sanityToast = useAppStoreContext((s) => s.sanityToast)

  const onGenerateSvgHtml = () => {
    return generateSvgHtml({
      sanityValue,
      rotate,
      size,
      color,
      iconifyEndpoint,
      sanityToast,
    })
  }

  const onCopyHtmlToClipboard = (original?: boolean) => {
    copyHtmlToClipboard(
      { sanityValue, rotate, size, color, iconifyEndpoint, sanityToast },
      original,
    )
  }

  const onCopyDataUrlToClipboard = (original?: boolean) => {
    copyDataUrlToClipboard(
      { sanityValue, rotate, size, color, iconifyEndpoint, sanityToast },
      original,
    )
  }

  return {
    onGenerateSvgHtml,
    onCopyHtmlToClipboard,
    onCopyDataUrlToClipboard,
  }
}

export default useSvgUtils
