/* eslint-disable react/jsx-no-bind */
import { Flex, Switch, Text } from '@sanity/ui'
import { useTranslation } from 'sanity'

import useSvgUtils from '../../../hooks/useSvgUtils'
import { useAppStoreContext } from '../../../store/context'

const InlineSvg = () => {
  const { t } = useTranslation('sanity-plugin-inline-icon-manager')
  const { onGenerateSvgHtml } = useSvgUtils()
  const inlineSvg = useAppStoreContext((s) => s.inlineSvg)
  const setInlineSvg = useAppStoreContext((s) => s.setInlineSvg)

  const onChangeInlineSvg = async () => {
    setInlineSvg(inlineSvg ? undefined : await onGenerateSvgHtml())
  }

  return (
    <Flex
      direction={['column', 'column', 'row']}
      gap={[2, 2, 1]}
      align={['flex-start', 'flex-start', 'center']}
      style={{ width: '100%' }}
    >
      <Text weight='bold' size={1} style={{ width: '100px' }}>
        {t('config-dialog.inline-svg.text')}
      </Text>
      <Flex style={{ width: '100%' }}>
        <Switch checked={!!inlineSvg} onChange={onChangeInlineSvg} />
      </Flex>
    </Flex>
  )
}

export default InlineSvg
