import {FormEvent} from 'react'
import {set as patchSet, unset as patchUnset} from 'sanity'
import {StateCreator} from 'zustand'
import {AppStoreType} from '.'
import {INITIAL_HEIGHT, INITIAL_WIDTH} from '../lib/constants'
import {generateInitialSvgDownloadUrl, generateInitialSvgHttpUrl} from '../lib/svgUtils'
import {toastError} from '../lib/toastUtils'
import IconifyQueryResponse from '../types/IconifyQueryResponse'
import {IconifyType} from '../types/IconifyType'

const cacheResults = new Map<string, IconifyQueryResponse>()

export interface ResultsSlice {
  searchTerm?: string
  queryResults?: IconifyQueryResponse
  setSearchTerm: (event: FormEvent<HTMLInputElement>) => void
  setQueryResults: (queryResults: IconifyQueryResponse) => void
  searchIcons: () => void
  selectIcon: (event: FormEvent<HTMLButtonElement>) => void
  clearIcon: () => void
}

export const createResultsSlice: StateCreator<AppStoreType, [], [], ResultsSlice> = (set, get) => ({
  setSearchTerm: (event: FormEvent<HTMLInputElement>) =>
    set(() => ({searchTerm: event.currentTarget.value})),
  setQueryResults: (queryResults: IconifyQueryResponse) =>
    set(() => ({queryResults, currentPage: 0})),
  searchIcons: async () => {
    if (!get().searchTerm) return

    const searchParams = new URLSearchParams()
    const keywordStyle = get().filterStyle ? ` style=${get().filterStyle}` : ''
    const keywordPalette = get().filterPalette ? ` palette=${get().filterPalette}` : ''
    searchParams.append('query', `${get().searchTerm}${keywordStyle}${keywordPalette}`)
    searchParams.append('limit', get().limit.toString())

    let results
    const searchParamsString = searchParams.toString()
    if (cacheResults.has(searchParamsString)) {
      results = cacheResults.get(searchParamsString)!
    } else {
      cacheResults.delete(searchParamsString)
      const res = await fetch(`https://api.iconify.design/search?${searchParams.toString()}`)
      results = (await res.json()) as IconifyQueryResponse
      results.totalPages = results.total ? Math.ceil(results.total / get().iconsPerPage) : 1
      cacheResults.set(searchParams.toString(), results)
    }
    get().setQueryResults(results)
    get().toggleFilters(false)
  },
  selectIcon: async (event: FormEvent<HTMLButtonElement>) => {
    try {
      const value = event?.currentTarget.dataset.value
      const iconInfo = value?.split(':')
      if (iconInfo?.length === 2) {
        const collection = get().queryResults?.collections[iconInfo[0]]
        const objToSave: IconifyType = {
          icon: value!,
          metadata: {
            downloadUrl: generateInitialSvgDownloadUrl(value!),
            url: generateInitialSvgHttpUrl(value!),
            collectionId: iconInfo[0],
            collectionName: collection?.name || '',
            iconName: iconInfo[1],
            size: {width: INITIAL_WIDTH, height: INITIAL_HEIGHT},
            hFlip: false,
            vFlip: false,
            rotate: 0,
            palette: collection?.palette,
            author: {
              name: collection?.author.name,
              url: collection?.author.url,
            },
            license: {
              name: collection?.license.title,
              url: collection?.license.url,
            },
          },
        }
        const sanityPatch = get().sanityPatch
        if (sanityPatch) {
          await sanityPatch(patchSet(objToSave))
          get().setSanityValue(objToSave)
          get().closeSearchDialog()
          get().resetConfiguration()
        }
      }
    } catch (e: any) {
      toastError(e)
    }
  },
  clearIcon: async () => {
    try {
      const sanityPatch = get().sanityPatch
      if (sanityPatch) {
        await sanityPatch(patchUnset())
        get().closeRemoveDialog()
      }
    } catch (e: any) {
      const sanityToast = get().sanityToast
      if (sanityToast)
        sanityToast.push({status: 'error', title: 'Something went wrong', description: e.message})
    }
  },
})
