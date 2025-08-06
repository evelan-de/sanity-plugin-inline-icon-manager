import { Box, Button } from '@sanity/ui'
import { useCallback, useState } from 'react'
import { ChangeList, DiffProps, ObjectDiff } from 'sanity'

import { useTranslation } from '../../hooks/useTranslation'
import { IconManagerType } from '../../types/IconManagerType'

const IconDiffChangeList = (props: DiffProps<ObjectDiff<IconManagerType>>) => {
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)
  const { t } = useTranslation()

  const onClickDetailsHandler = useCallback(() => {
    setIsDetailsOpen((state) => !state)
  }, [setIsDetailsOpen])

  if (!props.diff.isChanged || (!props.diff.fromValue?.icon && !props.diff.toValue?.icon))
    return null

  return (
    <>
      <Button
        mode='ghost'
        tone='primary'
        text={`${
          isDetailsOpen
            ? t('icon-diff-change-list.button.hide-details')
            : t('icon-diff-change-list.button.show-details')
        }`}
        onClick={onClickDetailsHandler}
        style={{ cursor: 'pointer' }}
      />
      {isDetailsOpen && (
        <Box marginTop={5}>
          <ChangeList diff={props.diff} schemaType={props.schemaType} />
        </Box>
      )}
    </>
  )
}

export default IconDiffChangeList
