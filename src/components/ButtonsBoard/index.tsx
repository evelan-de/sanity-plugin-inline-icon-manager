import { BookIcon, InfoOutlineIcon, TrashIcon } from '@sanity/icons'
import { Button, Flex } from '@sanity/ui'
import { useTranslation } from 'sanity'

import { useAppStoreContext } from '../../store/context'
import CustomizeIcon from '../icons/CustomizeIcon'
import ButtonTooltip from './ButtonTooltip'

const ButtonsBoard = () => {
  const { t } = useTranslation('sanity-plugin-inline-icon-manager')

  const openInfoDialog = useAppStoreContext((s) => s.openInfoDialog)
  const openConfigDialog = useAppStoreContext((s) => s.openConfigDialog)
  const openSearchDialog = useAppStoreContext((s) => s.openSearchDialog)
  const openRemoveDialog = useAppStoreContext((s) => s.openRemoveDialog)
  const sanityUserCanEdit = useAppStoreContext((s) => s.sanityUserCanEdit)

  return (
    <Flex direction='column'>
      <ButtonTooltip tooltipText={t('buttons-board.tooltip.show-info')}>
        <Button
          mode='bleed'
          tone='primary'
          radius={6}
          icon={<InfoOutlineIcon width={25} height={25} />}
          style={{ cursor: 'pointer' }}
          onClick={openInfoDialog}
        />
      </ButtonTooltip>
      <ButtonTooltip tooltipText={t('buttons-board.tooltip.customize')}>
        <Button
          mode='bleed'
          tone='positive'
          radius={6}
          icon={<CustomizeIcon width={19} height={19} />}
          style={{ cursor: 'pointer' }}
          onClick={openConfigDialog}
          disabled={!sanityUserCanEdit}
        />
      </ButtonTooltip>
      <ButtonTooltip tooltipText={t('buttons-board.tooltip.change')}>
        <Button
          mode='bleed'
          tone='primary'
          radius={6}
          icon={<BookIcon width={25} height={25} />}
          style={{ cursor: 'pointer' }}
          onClick={openSearchDialog}
          disabled={!sanityUserCanEdit}
        />
      </ButtonTooltip>
      <ButtonTooltip tooltipText={t('buttons-board.tooltip.delete')}>
        <Button
          mode='bleed'
          tone='critical'
          radius={6}
          icon={<TrashIcon width={25} height={25} />}
          style={{ cursor: 'pointer' }}
          onClick={openRemoveDialog}
          disabled={!sanityUserCanEdit}
        />
      </ButtonTooltip>
    </Flex>
  )
}

export default ButtonsBoard
