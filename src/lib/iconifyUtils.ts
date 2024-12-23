import IconManagerQueryResponse, { IconManagerIconInfo } from '../types/IconManagerQueryResponse'

export const stringifyHeight = (str?: number | number[]): string => {
  if (!str) return ''
  if (typeof str === 'number') return str.toString()
  return str.join(', ')
}

export const parseSearchResults = (results: IconManagerQueryResponse): IconManagerIconInfo[] => {
  return results.icons.reduce((acc, curr) => {
    const iconInfo = curr.split(':')
    const collection = { code: iconInfo[0], ...results.collections[iconInfo[0]] }
    acc.push({ icon: curr, iconName: iconInfo[1], collection })
    return acc
  }, [] as IconManagerIconInfo[])
}
