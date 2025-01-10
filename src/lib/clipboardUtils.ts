import { ToastContextValue } from '@sanity/ui'

import { AppStoreTypePartial, generateSvgDataUrl, generateSvgHtml } from './svgUtils'
import { toastError, toastSuccess } from './toastUtils'

export const copy2Clipboard = async (
  text: string,
  sanityToast: ToastContextValue | undefined,
): Promise<boolean> => {
  try {
    await navigator.clipboard.writeText(text)
    toastSuccess({ sanityToast, title: 'Copied to clipboard' })
    return true
  } catch (e: unknown) {
    toastError(sanityToast, e)
    return false
  }
}

export const copyHtmlToClipboard = async (appState: AppStoreTypePartial): Promise<void> => {
  const html = await generateSvgHtml(appState)
  if (html) copy2Clipboard(html, appState.sanityToast)
}

export const copyDataUrlToClipboard = async (appState: AppStoreTypePartial): Promise<void> => {
  const dataUrl = await generateSvgDataUrl(appState)
  if (dataUrl) copy2Clipboard(dataUrl, appState.sanityToast)
}
