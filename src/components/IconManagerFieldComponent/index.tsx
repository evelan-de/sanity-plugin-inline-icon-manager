import { ObjectFieldProps } from 'sanity'

import { useTranslation } from '../../hooks/useTranslation'

/**
 * This changes the title of the field as to have correct translation
 */
const IconManagerFieldComponent = (fieldProps: ObjectFieldProps) => {
  const { t } = useTranslation()

  const modifiedFieldProps: ObjectFieldProps = {
    ...fieldProps,
    title: t('icon-manager.schema.title'),
  }

  return fieldProps.renderDefault(modifiedFieldProps)
}

export default IconManagerFieldComponent
