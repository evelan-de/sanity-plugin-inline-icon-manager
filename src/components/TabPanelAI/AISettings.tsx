import { EyeClosedIcon, EyeOpenIcon } from '@sanity/icons'
import { Box, Button, Dialog, Flex, Text, TextInput, useToast } from '@sanity/ui'
import { FormEvent, useCallback, useEffect, useState } from 'react'

import { useAISecrets } from '../../hooks/useAISecrets'

interface AISettingsProps {
  onClose: () => void
}

const AISettings = ({ onClose }: AISettingsProps) => {
  const { secrets, loading, storeSecrets } = useAISecrets()
  const [apiKey, setApiKey] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const toast = useToast()

  // Initialize API key from secrets
  useEffect(() => {
    if (!loading && secrets?.openaiApiKey) {
      setApiKey(secrets.openaiApiKey)
    }
  }, [loading, secrets])

  const handleClose = useCallback(() => {
    onClose()
  }, [onClose])

  const handleApiKeyChange = useCallback((event: FormEvent<HTMLInputElement>) => {
    setApiKey(event.currentTarget.value.trim())
  }, [])

  const handleSave = useCallback(() => {
    try {
      // Store the API key in secrets
      storeSecrets({
        openaiApiKey: apiKey,
      })

      // Show success toast
      toast.push({
        status: 'success',
        title: 'API Key Saved',
        description: 'Your OpenAI API key has been saved successfully.',
      })

      // Close the dialog
      handleClose()
    } catch (error) {
      console.error('Failed to store API key:', error)
      // Show error toast
      toast.push({
        status: 'error',
        title: 'Error Saving API Key',
        description: 'There was a problem saving your API key. Please try again.',
      })
    }
  }, [apiKey, storeSecrets, toast, handleClose])

  return (
    <Dialog
      header='OpenAI API Key Settings'
      id='ai-settings'
      onClose={handleClose}
      zOffset={1001}
      width={1}
    >
      <Box padding={4}>
        <Flex direction='column' gap={4}>
          <Flex direction='column' gap={2}>
            <Text size={1} weight='semibold'>
              OpenAI API Key
            </Text>
            <Flex>
              <Box flex={1}>
                <TextInput
                  fontSize={2}
                  onChange={handleApiKeyChange}
                  padding={3}
                  placeholder='Enter your OpenAI API key'
                  disabled={loading}
                  value={apiKey}
                  type={showPassword ? 'text' : 'password'}
                />
              </Box>
              <Button
                mode='ghost'
                icon={showPassword ? EyeOpenIcon : EyeClosedIcon}
                onClick={useCallback(() => setShowPassword((prev) => !prev), [])}
                title={showPassword ? 'Hide API key' : 'Show API key'}
                style={{ marginLeft: '-40px' }}
              />
            </Flex>
            <Text size={0} muted>
              Your API key is stored securely in Sanity Studio and is only accessible to you.
            </Text>
          </Flex>

          <Flex justify='flex-end' gap={2}>
            <Button mode='ghost' text='Cancel' onClick={handleClose} disabled={loading} />
            <Button tone='primary' text='Save' onClick={handleSave} disabled={loading || !apiKey} />
          </Flex>
        </Flex>
      </Box>
    </Dialog>
  )
}

export default AISettings
