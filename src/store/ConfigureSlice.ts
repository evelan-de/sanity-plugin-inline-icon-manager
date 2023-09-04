import {FormEvent} from 'react'
import {RgbaColor} from 'react-colorful'
import {set as patchSet, unset as patchUnset} from 'sanity'
import {StateCreator} from 'zustand'
import {AppStoreType} from '.'
import {hexToRgba, rgbaToHex} from '../lib/colorUtils'
import {Flip, getFlipValue} from '../lib/iconifyUtils'
import {generateSvgDownloadUrl, generateSvgHtml, generateSvgHttpUrl} from '../lib/svgUtils'
import {toastError, toastSuccess, toastWarning} from '../lib/toastUtils'
import {IconifyColor, IconifySize} from '../types/IconifyType'

const initialState = {
  hFlip: false,
  vFlip: false,
  rotate: 0,
  inlineSvg: '',
  size: {width: 16, height: 16},
  uniqueSize: false,
  color: undefined,
  previewBorder: false,
}

export interface ConfigureSlice {
  hFlip: boolean
  vFlip: boolean
  rotate: number
  size: IconifySize
  inlineSvg: string
  uniqueSize: boolean
  previewBorder: boolean
  color?: IconifyColor
  hasBeenCustomized: () => boolean
  clearConfiguration: () => void
  resetConfiguration: () => void
  getFlipValue: () => Flip
  setFlip: (hFlip: boolean, vFlip: boolean) => void
  toggleHFlip: () => void
  toggleVFlip: () => void
  setRotate: (rotate: number) => void
  setRotate0: () => void
  setRotate90: () => void
  setRotate180: () => void
  setRotate270: () => void
  setInlineSvg: (inlineSvg?: string) => void
  setWidth: (event: FormEvent<HTMLInputElement> | number) => void
  setHeight: (event: FormEvent<HTMLInputElement> | number) => void
  toggleUniqueSize: () => void
  togglePreviewBorder: () => void
  setColor: (color: RgbaColor | string) => void
  clearColor: () => void
  saveConfiguration: () => void
}

export const createConfigureSlice: StateCreator<AppStoreType, [], [], ConfigureSlice> = (
  set,
  get,
) => ({
  ...initialState,
  hasBeenCustomized: () => {
    let count = 0
    const SV = get().sanityValue
    if (!SV || !SV.metadata) return false
    if (SV.metadata.inlineSvg) count++
    if (SV.metadata.hFlip) count++
    if (SV.metadata.vFlip) count++
    if (SV.metadata.rotate > 0) count++
    if (SV.metadata.size.width !== 16) count++
    if (SV.metadata.size.height !== 16) count++
    if (SV.metadata.color && SV.metadata.color.hex) count++
    return count > 0
  },
  clearConfiguration: () => set(initialState),
  resetConfiguration: () =>
    set(() => ({
      hFlip: get().sanityValue?.metadata.hFlip,
      vFlip: get().sanityValue?.metadata.vFlip,
      rotate: get().sanityValue?.metadata.rotate,
      size: get().sanityValue?.metadata.size,
      color: get().sanityValue?.metadata.color,
      inlineSvg: get().sanityValue?.metadata.inlineSvg,
      previewBorder: false,
      uniqueSize: false,
    })),
  getFlipValue: () => getFlipValue(get().hFlip, get().vFlip),
  setFlip: (hFlip, vFlip) => set(() => ({hFlip, vFlip})),
  toggleHFlip: () => set((s) => ({hFlip: !s.hFlip})),
  toggleVFlip: () => set((s) => ({vFlip: !s.vFlip})),
  setRotate: (rotate: number) => set(() => ({rotate})),
  setRotate0: () => set(() => ({rotate: 0})),
  setRotate90: () => set((s) => ({rotate: s.rotate === 1 ? 0 : 1})),
  setRotate180: () => set((s) => ({rotate: s.rotate === 2 ? 0 : 2})),
  setRotate270: () => set((s) => ({rotate: s.rotate === 3 ? 0 : 3})),
  setInlineSvg: (inlineSvg?: string) => set(() => ({inlineSvg})),
  setWidth: (event: FormEvent<HTMLInputElement> | number) =>
    set((s) => {
      const width = typeof event === 'number' ? event : Number(event.currentTarget.value)
      const height = get().uniqueSize ? width : s.size.height
      return {size: {width, height}}
    }),
  setHeight: (event: FormEvent<HTMLInputElement> | number) =>
    set((s) => {
      const height = typeof event === 'number' ? event : Number(event.currentTarget.value)
      const width = get().uniqueSize ? height : s.size.width
      return {size: {width, height}}
    }),
  toggleUniqueSize: () => set((s) => ({uniqueSize: !s.uniqueSize})),
  togglePreviewBorder: () => set((s) => ({previewBorder: !s.previewBorder})),
  setColor: (color: RgbaColor | string) =>
    set(() => {
      let hex: string
      let rgba: RgbaColor
      if (typeof color === 'string') {
        hex = color
        rgba = hexToRgba(color)
      } else {
        rgba = color
        hex = rgbaToHex(color)
      }
      return {color: {hex, rgba}}
    }),
  clearColor: () => set((s) => ({color: undefined})),
  saveConfiguration: async () => {
    try {
      const sanityPatch = get().sanityPatch
      if (sanityPatch) {
        const sanityValue = get().sanityValue
        if (!sanityValue) throw Error('The stored value is broken')

        const patches = []

        if (get().hFlip !== sanityValue.metadata.hFlip)
          patches.push(patchSet(get().hFlip, ['metadata.hFlip']))
        if (get().vFlip !== sanityValue.metadata.vFlip)
          patches.push(patchSet(get().vFlip, ['metadata.vFlip']))
        if (get().rotate !== sanityValue.metadata.rotate)
          patches.push(patchSet(get().rotate, ['metadata.rotate']))
        if (get().size.width !== sanityValue.metadata.size.width)
          patches.push(patchSet(get().size?.width, ['metadata.size.width']))
        if (get().size.height !== sanityValue.metadata.size.height)
          patches.push(patchSet(get().size?.height, ['metadata.size.height']))

        const color = get().color
        const sanityColor = sanityValue.metadata.color
        // CASE 1: new color and no previous color saved
        if (!sanityColor && color) {
          patches.push(patchSet(color, ['metadata.color']))
        }
        // CASE 2: previous color and new color removed
        else if (sanityColor && !color) {
          patches.push(patchUnset(['metadata.color']))
        }
        // CASE 3: both populated
        else if (color && sanityColor) {
          if (color.hex !== sanityColor.hex) {
            patches.push(patchSet(color.hex, ['metadata.color.hex']))
            patches.push(patchSet(color.rgba, ['metadata.color.rgba']))
          }
        }

        // generate updated svg html
        if (!get().inlineSvg && sanityValue.metadata.inlineSvg) {
          patches.push(patchUnset(['metadata.inlineSvg']))
        } else if (get().inlineSvg) {
          patches.push(patchSet(await generateSvgHtml(), ['metadata.inlineSvg']))
        }

        if (patches.length > 0) {
          // update urls too if something has changed
          patches.push(patchSet(generateSvgHttpUrl(), ['metadata.url']))
          patches.push(patchSet(generateSvgDownloadUrl(), ['metadata.downloadUrl']))

          await sanityPatch(patches)
          get().closeConfigDialog()
          toastSuccess('Configuration Saved')
        } else {
          toastWarning({title: 'Nothing to update', description: `Configuration didn't change`})
        }
      }
    } catch (e: unknown) {
      toastError(e)
    }
  },
})
