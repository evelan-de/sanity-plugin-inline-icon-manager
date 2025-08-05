import { Button } from '@sanity/ui'

import { useTranslation } from '../../hooks/useTranslation'
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
  const { t } = useTranslation()

  return (
    <>
      <ButtonTooltip tooltipText={t('svg-buttons-board.tooltip.copy-html')}>
        <Button
          mode='bleed'
          tone='primary'
          icon={<HtmlIcon width='25px' height='25px' />}
          style={{ cursor: 'pointer' }}
          onClick={onCopyHtmlToClipboard}
        />
      </ButtonTooltip>
      <ButtonTooltip tooltipText={t('svg-buttons-board.tooltip.copy-data-url')}>
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
