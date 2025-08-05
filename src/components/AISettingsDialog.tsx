/**
 * @file AISettingsDialog.tsx
 *
 * Enhanced AI settings dialog based on the AISettings.tsx reference pattern.
 * Features dynamic provider inputs, global model selection, and provider-aware UI.
 */

import { CogIcon } from '@sanity/icons'
import { Box, Button, Dialog, Flex, Text, TextInput, useToast } from '@sanity/ui'
import React, { FormEvent, useCallback, useEffect, useMemo, useState } from 'react'

import { useAISecrets } from '../hooks/useAISecrets'
import { useTranslation } from '../hooks/useTranslation'
import { aiProviderRegistry } from '../services/ai-provider-registry'

interface AISettingsDialogProps {
  /** Custom secrets namespace (optional) */
  namespace?: string
  /** Callback when settings are saved (optional) */
  onSave?: () => void
  /** Callback when dialog is closed (optional) */
  onClose?: () => void
}

function AISettingsDialog({ namespace, onSave, onClose }: AISettingsDialogProps) {
  const { secrets, storeSecrets, loading } = useAISecrets(namespace)
  const [keys, setKeys] = useState<Record<string, string>>({})
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const toast = useToast()
  const { t } = useTranslation()

  // Get available providers (memoized to prevent infinite re-renders)
  const providers = useMemo(() => aiProviderRegistry.getProviders(), [])

  // Initialize state from secrets
  useEffect(() => {
    if (!loading && secrets) {
      // Extract API keys
      const apiKeys: Record<string, string> = {}
      for (const provider of providers) {
        const key = secrets[provider.keyName]
        if (typeof key === 'string') {
          apiKeys[provider.keyName] = key
        }
      }
      setKeys(apiKeys)
    }
  }, [loading, secrets, providers])

  /**
   * Handle API key input changes with cleanup logic
   */
  const updateKeys = useCallback((event: FormEvent<HTMLInputElement>, key: string) => {
    const value = event.currentTarget.value.trim()

    if (value === '') {
      // Remove the key and clean up related configurations
      setKeys((prevKeys) => {
        const newKeys = { ...prevKeys }
        delete newKeys[key]

        return newKeys
      })
      return
    }

    setKeys((prevKeys) => ({
      ...prevKeys,
      [key]: value,
    }))
  }, [])

  /**
   * Save settings to secrets
   */
  const submitKeys = useCallback(async () => {
    try {
      await storeSecrets({
        ...keys,
      })

      // Show success toast
      toast.push({
        status: 'success',
        title: t('ai-settings-dialog.toast.success.title'),
        description: t('ai-settings-dialog.toast.success.description'),
      })

      setIsDialogOpen(false)
      onSave?.()
    } catch (error) {
      console.error('Failed to store AI settings:', error)

      // Show error toast
      toast.push({
        status: 'error',
        title: t('ai-settings-dialog.toast.error.title'),
        description: t('ai-settings-dialog.toast.error.description'),
      })
    }
  }, [keys, storeSecrets, toast, setIsDialogOpen, onSave, t])

  /**
   * Handle mouse down to stop propagation
   */
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.stopPropagation()
  }, [])

  /**
   * Handle click to stop propagation
   */
  const handleClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation()
  }, [])

  /**
   * Create onChange handler for API key inputs
   */
  const createKeyChangeHandler = useCallback(
    (keyName: string) => {
      return (event: React.ChangeEvent<HTMLInputElement>) => {
        updateKeys(event, keyName)
      }
    },
    [updateKeys],
  )

  /**
   * Handle dialog close with state reset
   */
  const handleClose = useCallback(() => {
    // Reset to original state from secrets
    if (secrets) {
      const apiKeys: Record<string, string> = {}
      for (const provider of providers) {
        const key = secrets[provider.keyName]
        if (typeof key === 'string') {
          apiKeys[provider.keyName] = key
        }
      }
      setKeys(apiKeys)
    }

    setIsDialogOpen(false)

    // Call the onClose prop if provided
    onClose?.()
  }, [secrets, providers, setKeys, setIsDialogOpen, onClose])

  /**
   * Open dialog
   */
  const openDialog = useCallback(() => {
    setIsDialogOpen(true)
  }, [setIsDialogOpen])

  return (
    <>
      {/* Dialog trigger button */}
      <Button
        tone='primary'
        mode='ghost'
        onClick={openDialog}
        selected={isDialogOpen}
        text={t('ai-settings-dialog.dialog-trigger-button')}
        icon={<CogIcon />}
      />

      {/* Settings dialog */}
      {isDialogOpen && (
        <Dialog
          header={t('ai-settings-dialog.dialog-header-title')}
          id='ai-settings'
          onClose={handleClose}
          zOffset={1001}
          onMouseDown={handleMouseDown}
          onClick={handleClick}
          animate
        >
          <Flex direction='column' gap={4} padding={4} paddingTop={2}>
            {/* Provider API Keys Section */}
            <Box>
              <Text size={2} weight='semibold' style={{ marginBottom: '1rem' }}>
                {t('ai-settings-dialog.api-keys-title')}
              </Text>

              {providers.length === 0 ? (
                <Box padding={3}>
                  <Text muted size={1}>
                    {t('ai-settings-dialog.no-providers')}
                  </Text>
                </Box>
              ) : (
                <Flex direction='column' gap={3}>
                  {providers.map((provider) => (
                    <Flex key={provider.keyName} direction='column' gap={2}>
                      <Text size={1} weight='semibold'>
                        {provider.keyTitle}
                      </Text>
                      <TextInput
                        fontSize={2}
                        onChange={createKeyChangeHandler(provider.keyName)}
                        padding={3}
                        placeholder={t('ai-settings-dialog.provider-placeholder', {
                          providerKeyTitle: provider.keyTitle,
                        })}
                        disabled={loading}
                        value={keys[provider.keyName] || ''}
                        type='password'
                      />
                    </Flex>
                  ))}
                </Flex>
              )}
            </Box>

            {/* Actions */}
            <Button
              onClick={submitKeys}
              disabled={loading}
              tone='primary'
              type='button'
              text={t('ai-settings-dialog.button-save')}
            />
          </Flex>
        </Dialog>
      )}
    </>
  )
}

export default AISettingsDialog
