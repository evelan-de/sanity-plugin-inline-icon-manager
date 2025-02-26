import { buildIcon, IconifyIconCustomisations, loadIcon } from '@iconify/react'
import { iconToHTML, replaceIDs, svgToData } from '@iconify/utils'
import DomPurify from 'dompurify'

// eslint-disable-next-line import/no-cycle
import { AppStoreType } from '../store/context'
import { INITIAL_HEIGHT, INITIAL_WIDTH } from './constants'
import { toastError } from './toastUtils'

export type AppStoreTypePartial = Pick<
  AppStoreType,
  'sanityValue' | 'color' | 'sanityToast' | 'iconifyEndpoint'
>

const buildIconHtml = async (icon: string, customizations?: IconifyIconCustomisations) => {
  const lData = await loadIcon(icon)
  const bData = buildIcon(lData, customizations || {})
  const html = iconToHTML(replaceIDs(bData.body), bData.attributes)
  return html
}

const generateSearchParams = (
  original: boolean,
  appState: AppStoreTypePartial,
  download: boolean,
): string => {
  const searchParams = new URLSearchParams()
  if (!original) {
    if (appState.color && appState.color.hex) searchParams.append('color', appState.color.hex)
  }
  if (download) {
    searchParams.append('download', '1')
  }
  return searchParams.size > 0 ? `?${searchParams.toString()}` : ''
}

const generateInitialSearchParams = (download: boolean = false): string => {
  const searchParams = new URLSearchParams()
  searchParams.append('width', `${INITIAL_WIDTH}`)
  searchParams.append('height', `${INITIAL_HEIGHT}`)
  if (download) {
    searchParams.append('download', '1')
  }
  return searchParams.toString()
}

export const generateInitialSvgHttpUrl = (iconifyEndpoint: string, icon: string): string => {
  const searchParams = generateInitialSearchParams()
  return `${iconifyEndpoint}/${icon}.svg?${searchParams}`
}

export const generateInitialSvgDownloadUrl = (iconifyEndpoint: string, icon: string): string => {
  const searchParams = generateInitialSearchParams(true)
  return `${iconifyEndpoint}/${icon}.svg?${searchParams}`
}

export const generateSvgHttpUrl = (
  appState: AppStoreTypePartial,
  original: boolean = false,
): string => {
  try {
    const icon = appState.sanityValue?.icon
    if (!icon) throw Error('Unable to find the icon.')

    const searchParams = generateSearchParams(original, appState, false)
    return `${appState.iconifyEndpoint}/${icon}.svg${searchParams}`
  } catch (e: any) {
    toastError(appState.sanityToast, e)
    return '#'
  }
}

export const generateSvgHtml = async (
  appState: AppStoreTypePartial,
  saveIcon?: string,
): Promise<string> => {
  try {
    const icon = saveIcon ?? appState.sanityValue?.icon

    if (!icon) throw Error('Unable to find the icon.')

    let html = await buildIconHtml(icon)
    if (!html) throw Error('Unable to generate Svg Html')
    if (appState.color?.hex) html = html.replaceAll('currentColor', appState.color?.hex)
    return DomPurify.sanitize(html)
  } catch (e: any) {
    toastError(appState.sanityToast, e)
    return ''
  }
}

export const generateSvgDataUrl = async (appState: AppStoreTypePartial): Promise<void | string> => {
  try {
    const html = await generateSvgHtml(appState)
    if (!html) return undefined
    const base64 = svgToData(html)
    if (!base64) throw Error('Unable to generate Svg Data URL')
    return base64
  } catch (e: any) {
    toastError(appState.sanityToast, e)
    return undefined
  }
}
