/* eslint-disable import/no-cycle */
import { FormEvent } from 'react'
import { RgbaColor } from 'react-colorful'
import { set as patchSet, unset as patchUnset } from 'sanity'
import { StateCreator } from 'zustand'

import { hexToRgba, isValidHex, rgbaToHex } from '../../lib/colorUtils'
import { INITIAL_HEIGHT, INITIAL_ROTATE, INITIAL_WIDTH } from '../../lib/constants'
import { generateSvgHtml, generateSvgHttpUrl } from '../../lib/svgUtils'
import { toastError, toastSuccess, toastWarning } from '../../lib/toastUtils'
import { IconManagerColor, IconManagerSize } from '../../types/IconManagerType'
import { DialogSlice } from './DialogSlice'
import { PluginOptionsSlice } from './PluginOptionsSlice'
import { SanitySlice } from './SanitySlice'

const initialState = {
  rotate: INITIAL_ROTATE,
  inlineSvg: '',
  size: { width: INITIAL_WIDTH, height: INITIAL_HEIGHT },
  uniqueSize: false,
  color: undefined,
  previewBorder: false,
}

export interface ConfigureSlice {
  rotate: number
  size: IconManagerSize
  inlineSvg: string
  uniqueSize: boolean
  previewBorder: boolean
  color?: IconManagerColor
  hasBeenCustomized: () => boolean
  clearConfiguration: () => void
  resetConfiguration: () => void
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

export const createConfigureSlice: StateCreator<
  ConfigureSlice & SanitySlice & DialogSlice & PluginOptionsSlice,
  [],
  [],
  ConfigureSlice
> = (set, get) => ({
  ...initialState,
  hasBeenCustomized: () => {
    let count = 0
    const SV = get().sanityValue
    if (!SV || !SV.metadata) return false
    if (SV.metadata.inlineSvg) count++
    if (SV.metadata.rotate > 0) count++
    if (SV.metadata.size.width !== INITIAL_WIDTH) count++
    if (SV.metadata.size.height !== INITIAL_HEIGHT) count++
    if (SV.metadata.color && SV.metadata.color.hex) count++
    return count > 0
  },
  clearConfiguration: () => set(initialState),
  resetConfiguration: () => {
    const sanityValue = get().sanityValue
    set(() => ({
      rotate: sanityValue?.metadata.rotate,
      size: sanityValue?.metadata.size,
      color: sanityValue?.metadata.color,
      inlineSvg: sanityValue?.metadata.inlineSvg,
      previewBorder: false,
      uniqueSize: false,
    }))
  },
  setRotate: (rotate: number) => set(() => ({ rotate })),
  setRotate0: () => set(() => ({ rotate: 0 })),
  setRotate90: () => set((s) => ({ rotate: s.rotate === 1 ? 0 : 1 })),
  setRotate180: () => set((s) => ({ rotate: s.rotate === 2 ? 0 : 2 })),
  setRotate270: () => set((s) => ({ rotate: s.rotate === 3 ? 0 : 3 })),
  setInlineSvg: (inlineSvg?: string) => set(() => ({ inlineSvg })),
  setWidth: (event: FormEvent<HTMLInputElement> | number) =>
    set((s) => {
      const width = typeof event === 'number' ? event : Number(event.currentTarget.value)
      const height = get().uniqueSize ? width : s.size.height
      return { size: { width, height } }
    }),
  setHeight: (event: FormEvent<HTMLInputElement> | number) =>
    set((s) => {
      const height = typeof event === 'number' ? event : Number(event.currentTarget.value)
      const width = get().uniqueSize ? height : s.size.width
      return { size: { width, height } }
    }),
  toggleUniqueSize: () => set((s) => ({ uniqueSize: !s.uniqueSize })),
  togglePreviewBorder: () => set((s) => ({ previewBorder: !s.previewBorder })),
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
      return { color: { hex, rgba } }
    }),
  clearColor: () => set((s) => ({ color: undefined })),
  saveConfiguration: async () => {
    try {
      const sanityPatch = get().sanityPatch
      if (sanityPatch) {
        const sanityValue = get().sanityValue
        if (!sanityValue) throw Error('The stored value is broken')

        const patches = []

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
          if (isValidHex(color.hex)) {
            patches.push(patchSet(color, ['metadata.color']))
          } else {
            toastError(get().sanityToast, `${color.hex} is not a valid color`)
            return
          }
        }
        // CASE 2: previous color and new color removed
        else if (sanityColor && !color) {
          patches.push(patchUnset(['metadata.color']))
        }
        // CASE 3: both populated and not equals
        else if (color && sanityColor && color.hex !== sanityColor.hex) {
          if (isValidHex(color.hex)) {
            patches.push(patchSet(color.hex, ['metadata.color.hex']))
            patches.push(patchSet(color.rgba, ['metadata.color.rgba']))
          } else {
            toastError(get().sanityToast, `${color.hex} is not a valid color`)
            return
          }
        }

        const storeInlineSvg = get().storeInlineSvg

        if (storeInlineSvg) {
          patches.push(patchSet(await generateSvgHtml(get()), ['metadata.inlineSvg']))
        } else {
          // check for inlineSvg option
          const currentInlineSvg = get().inlineSvg
          const prevInlineSvg = sanityValue.metadata.inlineSvg
          if (!currentInlineSvg && prevInlineSvg) {
            patches.push(patchUnset(['metadata.inlineSvg']))
          }
          if (
            (currentInlineSvg && !prevInlineSvg) ||
            (currentInlineSvg && currentInlineSvg !== prevInlineSvg) ||
            (currentInlineSvg && patches.length > 0)
          ) {
            patches.push(patchSet(await generateSvgHtml(get()), ['metadata.inlineSvg']))
          }
        }

        // if we have some patches, update the document
        if (patches.length > 0) {
          // update urls too if something has changed
          patches.push(patchSet(generateSvgHttpUrl(get()), ['metadata.url']))

          await sanityPatch(patches)
          get().closeConfigDialog()
          toastSuccess({ sanityToast: get().sanityToast, title: 'Configuration Saved' })
        } else {
          toastWarning({
            sanityToast: get().sanityToast,
            title: 'Nothing to update',
            description: `Configuration didn't change`,
          })
        }
      }
    } catch (e: unknown) {
      toastError(get().sanityToast, e)
    }
  },
})
