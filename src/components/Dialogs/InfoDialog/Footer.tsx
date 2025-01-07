/* eslint-disable react/jsx-no-bind */
import { Flex } from '@sanity/ui'

import useSvgUtils from '../../../hooks/useSvgUtils'
import SvgButtonsBoard from '../../SvgButtonsBoard'

const Footer = () => {
  const { onCopyHtmlToClipboard, onCopyDataUrlToClipboard } = useSvgUtils()
  return (
    <Flex padding={1} justify='flex-end' gap={3}>
      <SvgButtonsBoard
        onCopyHtmlToClipboard={() => onCopyHtmlToClipboard(true)}
        onCopyDataUrlToClipboard={() => onCopyDataUrlToClipboard(true)}
      />
    </Flex>
  )
}

export default Footer
