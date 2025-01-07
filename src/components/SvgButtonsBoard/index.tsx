import { Button } from '@sanity/ui'

import DataUrlIcon from '../icons/DataURLIcon'
import HtmlIcon from '../icons/HtmlIcon'
import ButtonTooltip from './ButtonTooltip'

interface SvgButtonsBoardProps {
  onCopyHtmlToClipboard: () => void
  onCopyDataUrlToClipboard: () => void
}

const SvgButtonsBoard = ({
  onCopyHtmlToClipboard,
  onCopyDataUrlToClipboard,
}: SvgButtonsBoardProps) => {
  return (
    <>
      <ButtonTooltip tooltipText='Copy svg html to clipboard'>
        <Button
          mode='bleed'
          tone='primary'
          icon={<HtmlIcon width='25px' height='25px' />}
          style={{ cursor: 'pointer' }}
          onClick={onCopyHtmlToClipboard}
        />
      </ButtonTooltip>
      <ButtonTooltip tooltipText='Copy svg Data URL to clipboard'>
        <Button
          mode='bleed'
          tone='primary'
          icon={<DataUrlIcon width='25px' height='25px' style={{ paddingTop: '6px' }} />}
          style={{ cursor: 'pointer' }}
          onClick={onCopyDataUrlToClipboard}
        />
      </ButtonTooltip>
    </>
  )
}

export default SvgButtonsBoard
