import { Flex, TabPanel } from '@sanity/ui'

import AIPromptInput from './AIPromptInput'
import AISuggestionsGrid from './AISuggestionsGrid'

interface TabPanelAIProps {
  hidden: boolean
}

const TabPanelAI = ({ hidden }: TabPanelAIProps) => {
  return (
    <TabPanel id='ai-panel' aria-labelledby='ai-tab' hidden={hidden}>
      <Flex direction='column' gap={4}>
        <AIPromptInput />
        <AISuggestionsGrid />
      </Flex>
    </TabPanel>
  )
}

export default TabPanelAI
