import { useDeferredValue, useState } from 'react'

import { useTranslation } from '../../hooks/useTranslation'
import CollectionsGrid from './CollectionsGrid'
import Input from './Input'

const Step0 = () => {
  const { t } = useTranslation()
  const [searchCollectionTerm, setSearchCollectionTerm] = useState('')
  const deferredSearchCollectionTerm = useDeferredValue(searchCollectionTerm)
  return (
    <>
      <Input
        placeholder={t('step-0.input-placeholder')}
        term={searchCollectionTerm}
        onChange={setSearchCollectionTerm}
      />
      <CollectionsGrid searchTerm={deferredSearchCollectionTerm} />
    </>
  )
}

export default Step0
