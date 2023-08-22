import {Icon} from '@iconify-icon/react'
import {WarningOutlineIcon} from '@sanity/icons'
import {Badge, Button, Card, Grid} from '@sanity/ui'
import {useAppStore} from '../store'

interface SearchResultsProps {}

const SearchResults = (props: SearchResultsProps) => {
  const queryResults = useAppStore((s) => s.queryResults)

  if (!queryResults) return null

  if (queryResults.total === 0)
    return (
      <Badge
        mode='outline'
        tone='critical'
        margin={4}
        style={{fontWeight: 'bold', fontSize: '20px', boxShadow: 'none'}}
      >
        <WarningOutlineIcon />
        &nbsp;&nbsp;No icons found!
      </Badge>
    )

  return (
    <Card border radius={2} margin={4} padding={4}>
      <Grid columns={[3, 5, 7, 10]} gap={5}>
        {queryResults?.icons.map((icon) => (
          <Button key={icon} mode='bleed'>
            <Icon icon={icon} width={30} />
          </Button>
        ))}
      </Grid>
    </Card>
  )
}

export default SearchResults
