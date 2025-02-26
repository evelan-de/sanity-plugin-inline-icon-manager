import { Button, Flex, Text, Tooltip } from '@sanity/ui'

import IconPreview from '../IconPreview'

interface ResultsGridItemProps {
  icon: string
  onClick: () => void
}

const ResultsGridItem = ({ icon, onClick }: ResultsGridItemProps) => {
  return (
    <Flex
      justify='center'
      as='li'
      key={icon}
      style={{ width: 50, height: 50, justifySelf: 'center' }}
    >
      <Tooltip
        portal
        placement='top'
        content={
          <Flex direction='column' padding={2} gap={2}>
            <Text size={1} weight='bold'>
              {icon}
            </Text>
          </Flex>
        }
      >
        <Button
          key={icon}
          mode='bleed'
          icon={<IconPreview icon={icon} width='30' height='30' />}
          data-value={icon}
          onClick={onClick}
          style={{ cursor: 'pointer' }}
        />
      </Tooltip>
    </Flex>
  )
}

export default ResultsGridItem
