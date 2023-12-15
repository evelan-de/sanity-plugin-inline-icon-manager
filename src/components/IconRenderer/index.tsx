import parse from 'html-react-parser'
import {sanitize} from 'isomorphic-dompurify'
import {FC} from 'react'
import {IconManagerType} from '../../types/IconManagerType'

interface IconRendererProps extends IconManagerType {
  className?: string
}

const IconRenderer: FC<IconRendererProps> = (props) => {
  const {icon, metadata, className} = props

  if (icon && metadata?.inlineSvg) {
    const {inlineSvg} = metadata
    const svgRender = inlineSvg.replace('<svg', `<svg class="${className}"`) // Add in the classNames to the inline svg string

    return parse(sanitize(svgRender))
  }

  return null
}

export default IconRenderer
