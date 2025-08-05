import { BookIcon } from '@sanity/icons'
import { Button } from '@sanity/ui'

import { useTranslation } from '../../hooks/useTranslation'
import { useAppStoreContext } from '../../store/context'

const EmptyState = () => {
  const { t } = useTranslation()
  const sanityValue = useAppStoreContext((s) => s.sanityValue)
  const sanityUserCanEdit = useAppStoreContext((s) => s.sanityUserCanEdit)
  const openSearchDialog = useAppStoreContext((s) => s.openSearchDialog)

  if (sanityValue?.icon) return null

  return (
    <Button
      mode='default'
      tone='primary'
      text={t('app-states.empty-state.select-icon')}
      icon={<BookIcon width={18} />}
      fontSize={1}
      onClick={openSearchDialog}
      disabled={!sanityUserCanEdit}
    />
  )
}

export default EmptyState
