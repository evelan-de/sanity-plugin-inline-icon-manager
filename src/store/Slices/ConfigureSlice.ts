/* eslint-disable import/no-cycle */
import { RgbaColor } from 'react-colorful'
import { set as patchSet, unset as patchUnset } from 'sanity'
import { StateCreator } from 'zustand'

import { hexToRgba, isValidHex, rgbaToHex } from '../../lib/colorUtils'
import { generateSvgHtml } from '../../lib/svgUtils'
import { toastError, toastSuccess, toastWarning } from '../../lib/toastUtils'
import { IconManagerColor } from '../../types/IconManagerType'
import { DialogSlice } from './DialogSlice'
import { PluginOptionsSlice } from './PluginOptionsSlice'
import { SanitySlice } from './SanitySlice'

const initialState = {
  inlineSvg: '',
  uniqueSize: false,
  color: undefined,
  previewBorder: false,
}

export interface ConfigureSlice {
  inlineSvg: string
  uniqueSize: boolean
  previewBorder: boolean
  color?: IconManagerColor
  hasBeenCustomized: () => boolean
  clearConfiguration: () => void
  resetConfiguration: () => void
  setInlineSvg: (inlineSvg?: string) => void
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
    if (!SV?.metadata) {
      return false
    }
    if (SV.metadata.inlineSvg) {
      count++
    }
    if (SV.metadata.color?.hex) {
      count++
    }
    return count > 0
  },
  clearConfiguration: () => set(initialState),
  resetConfiguration: () => {
    const sanityValue = get().sanityValue
    set(() => ({
      color: sanityValue?.metadata.color,
      inlineSvg: sanityValue?.metadata.inlineSvg,
      previewBorder: false,
      uniqueSize: false,
    }))
  },
  setInlineSvg: (inlineSvg?: string) => set(() => ({ inlineSvg })),
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
