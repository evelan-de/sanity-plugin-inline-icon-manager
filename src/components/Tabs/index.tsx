/* eslint-disable react/jsx-no-bind */
import { BookIcon, SearchIcon, SparklesIcon } from '@sanity/icons'
import { Tab, TabList } from '@sanity/ui'
import { useState } from 'react'

import { useTranslation } from '../../hooks/useTranslation'
import TabPanelAI from '../TabPanelAI'
import TabPanelCollection from '../TabPanelCollection'
import TabContentSearch from '../TabPanelSearch'

const Tabs = () => {
  const { t } = useTranslation()
  const [tab, setTab] = useState<'search' | 'collection' | 'ai'>('search')

  return (
    <>
      <TabList padding={4} paddingBottom={0} space={1}>
        <Tab
          id='search-tab'
          aria-controls='search-panel'
          selected={tab === 'search'}
          icon={SearchIcon}
          label={t('tabs.search')}
          onClick={() => setTab('search')}
        />
        <Tab
          id='collections-tab'
          aria-controls='collections-panel'
          selected={tab === 'collection'}
          icon={BookIcon}
          label={t('tabs.collections')}
          onClick={() => setTab('collection')}
        />
        <Tab
          id='ai-tab'
          aria-controls='ai-panel'
          selected={tab === 'ai'}
          icon={SparklesIcon}
          label={t('tabs.ai')}
          onClick={() => setTab('ai')}
        />
      </TabList>
      <TabContentSearch hidden={tab !== 'search'} />
      <TabPanelCollection hidden={tab !== 'collection'} />
      <TabPanelAI hidden={tab !== 'ai'} />
    </>
  )
}

export default Tabs
