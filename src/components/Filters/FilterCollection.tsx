import { Flex, Select, Text } from '@sanity/ui'
import { FormEvent, useCallback } from 'react'

import { useTranslation } from '../../hooks/useTranslation'
import { useAppStoreContext } from '../../store/context'

const FilterCollection = () => {
  const groupedCollections = useAppStoreContext((s) => s.groupedCollections)
  const filterCollection = useAppStoreContext((s) => s.filterCollection)
  const setFilterCollection = useAppStoreContext((s) => s.setFilterCollection)
  const { t } = useTranslation()

  const handleFilterCollectionChange = useCallback(
    (event: FormEvent<HTMLSelectElement>) => {
      const {
        currentTarget: { value, options, selectedIndex },
      } = event
      setFilterCollection(value, options[selectedIndex].innerText)
    },
    [setFilterCollection],
  )

  if (!groupedCollections) return null

  return (
    <Flex align='center'>
      <Text weight='bold' size={1} style={{ width: '100px' }}>
        {t('filter-collection.title')}:
      </Text>
      <Flex style={{ width: '100%' }}>
        <Select onChange={handleFilterCollectionChange} value={filterCollection?.code} fontSize={1}>
          <option value=''>{t('filter-collection.select')}</option>
          {Object.keys(groupedCollections).map((category) => (
            <optgroup key={category} label={category}>
              {groupedCollections[category].map((collection) => (
                <option key={collection.code} value={collection.code}>
                  {collection.name}
                </option>
              ))}
            </optgroup>
          ))}
        </Select>
      </Flex>
    </Flex>
  )
}

export default FilterCollection
