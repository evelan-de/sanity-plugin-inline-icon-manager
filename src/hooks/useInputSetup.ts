/* eslint-disable react-hooks/exhaustive-deps */
import { useToast } from '@sanity/ui'
import { useEffect } from 'react'
import { ObjectInputProps } from 'sanity'

import { DEFAULT_API_URL } from '../lib/constants'
import { useAppStoreContext } from '../store/context'
import IconManagerPluginOptions from '../types/IconManagerPluginOptions'
import { IconManagerType } from '../types/IconManagerType'

const useInputSetup = (
  objectInputProps: ObjectInputProps,
  pluginOptions: void | IconManagerPluginOptions,
): void => {
  const sanityToast = useToast()
  const setIconifyEndpoint = useAppStoreContext((s) => s.setIconifyEndpoint)
  const setPluginOptionCustomPalette = useAppStoreContext((s) => s.setPluginOptionCustomPalette)
  const setPluginOptionStoreInlineSvg = useAppStoreContext((s) => s.setPluginOptionStoreInlineSvg)
  const setAvailableCollectionsOption = useAppStoreContext((s) => s.setAvailableCollectionsOption)
  const setSanityFieldPath = useAppStoreContext((s) => s.setSanityFieldPath)
  const setSanityValue = useAppStoreContext((s) => s.setSanityValue)
  const setSanityPatch = useAppStoreContext((s) => s.setSanityPatch)
  const setSanityPathFocus = useAppStoreContext((s) => s.setSanityPathFocus)
  const setSanityToast = useAppStoreContext((s) => s.setSanityToast)
  const setSanityUserCanEdit = useAppStoreContext((s) => s.setSanityUserCanEdit)
  const setInlineSvg = useAppStoreContext((s) => s.setInlineSvg)
  const setColor = useAppStoreContext((s) => s.setColor)

  useEffect(() => {
    const value = objectInputProps.value as IconManagerType

    // setup sanity slice
    setSanityValue(value)

    if (value?.metadata) {
      // setup configure slice
      setInlineSvg(value.metadata.inlineSvg)
      if (value.metadata.color) setColor(value.metadata.color?.hex)
    }
  }, [objectInputProps.value])

  useEffect(() => {
    setSanityFieldPath(objectInputProps.path)
    setSanityPatch(objectInputProps.onChange)
    setSanityPathFocus(objectInputProps.onPathFocus)
    setSanityToast(sanityToast)
    setSanityUserCanEdit(!objectInputProps.readOnly)
    setIconifyEndpoint(pluginOptions?.customEndpoint ?? DEFAULT_API_URL)
    if (pluginOptions?.customPalette) setPluginOptionCustomPalette(pluginOptions.customPalette)
    if (pluginOptions?.storeInlineSvg) {
      setPluginOptionStoreInlineSvg(pluginOptions.storeInlineSvg)
    }
    if (pluginOptions?.availableCollections) {
      setAvailableCollectionsOption(pluginOptions.availableCollections)
    }
  }, [])
}

export default useInputSetup
