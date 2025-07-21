import parse from 'html-react-parser'
import DOMPurify from 'isomorphic-dompurify'
import { FC } from 'react'

import { IconManagerPartialType } from '../../types/IconManagerType'

interface IconInlineRendererProps extends IconManagerPartialType {
  className?: string
}

/**
 * Component for rendering the icon using the inline svg metadata string.
 *
 * Sample usage:
 * <IconInlineRenderer metadata={metadata} className="my-className" />
 */
export const IconInlineRenderer: FC<IconInlineRendererProps> = (props) => {
  const { icon, metadata, className } = props

  if (icon && metadata?.inlineSvg) {
    const { inlineSvg } = metadata

    // Add in the classNames to the inline svg string
    const svgRender = inlineSvg.replace('<svg', `<svg class="${className}"`)

    return parse(DOMPurify.sanitize(svgRender))
  }

  return null
}
