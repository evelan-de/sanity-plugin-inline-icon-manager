/**
 * @file AIProviderStatus.tsx
 *
 * Provider status component that displays configured providers, their health,
 * and provides quick setup actions and validation feedback.
 */

import { CheckmarkIcon, CloseIcon, WarningOutlineIcon } from '@sanity/icons'
import { Badge, Box, Button, Card, Flex, Text } from '@sanity/ui'
import React from 'react'

import { useAISecrets } from '../hooks/useAISecrets'
import { useAIReadiness } from '../hooks/useAISettings'
import { aiProviderRegistry } from '../services/ai-provider-registry'

interface AIProviderStatusProps {
  /** Custom secrets namespace (optional) */
  namespace?: string
  /** Show detailed information */
  detailed?: boolean
  /** Callback when setup is needed */
  onSetupClick?: () => void
}

export function AIProviderStatus({
  namespace,
  detailed = false,
  onSetupClick,
}: AIProviderStatusProps) {
  const { hasValidApiKey, loading } = useAISecrets(namespace)
  const { isReady, hasProviders, hasApiKeys } = useAIReadiness(namespace)

  // Get provider information
  const providers = aiProviderRegistry.getProviders()

  if (loading) {
    return (
      <Card padding={3} tone='transparent'>
        <Text size={1} muted>
          Loading AI provider status...
        </Text>
      </Card>
    )
  }

  if (!hasProviders) {
    return (
      <Card padding={3} tone='critical'>
        <Flex align='center' gap={2}>
          <CloseIcon />
          <Text size={1}>No AI providers configured</Text>
        </Flex>
      </Card>
    )
  }

  return (
    <Box>
      {/* Overall Status */}
      <Card padding={3} tone={isReady ? 'positive' : 'caution'} marginBottom={3}>
        <Flex align='center' justify='space-between'>
          <Flex align='center' gap={2}>
            {isReady ? <CheckmarkIcon /> : <WarningOutlineIcon />}
            <Text size={1} weight='semibold'>
              AI System {isReady ? 'Ready' : 'Needs Configuration'}
            </Text>
          </Flex>

          {!isReady && onSetupClick && (
            <Button size={1} tone='primary' onClick={onSetupClick} text='Setup' />
          )}
        </Flex>

        {detailed && (
          <Box marginTop={3}>
            <Flex gap={2} wrap='wrap'>
              <Badge tone={hasProviders ? 'positive' : 'critical'}>
                {providers.length} Provider
              </Badge>
              <Badge tone={hasApiKeys ? 'positive' : 'critical'}>
                {hasApiKeys ? 'API Keys Configured' : 'No API Keys'}
              </Badge>
            </Flex>
          </Box>
        )}
      </Card>

      {/* Individual Provider Status */}
      {detailed && (
        <Box>
          <Text size={1} weight='semibold' style={{ marginBottom: '1rem' }}>
            Provider Details
          </Text>

          <Flex direction='column' gap={2}>
            {providers.map((provider) => {
              const hasKey = hasValidApiKey(provider.keyName)
              const modelCount = provider.models.length

              return (
                <Card key={provider.keyName} padding={3} tone='transparent'>
                  <Flex align='center' justify='space-between'>
                    <Flex align='center' gap={2}>
                      {hasKey ? (
                        <CheckmarkIcon style={{ color: 'var(--card-positive-fg-color)' }} />
                      ) : (
                        <CloseIcon style={{ color: 'var(--card-critical-fg-color)' }} />
                      )}

                      <Box>
                        <Text size={1} weight='semibold'>
                          {provider.name}
                        </Text>
                        <Text size={0} muted>
                          {modelCount} model available
                        </Text>
                      </Box>
                    </Flex>

                    <Badge tone={hasKey ? 'positive' : 'critical'}>
                      {hasKey ? 'Connected' : 'No API Key'}
                    </Badge>
                  </Flex>

                  {/* Show available models if provider has API key */}
                  {hasKey && (
                    <Box marginTop={2}>
                      <Text size={0} muted>
                        Models: {provider.models.map((m) => m.modelName).join(', ')}
                      </Text>
                    </Box>
                  )}
                </Card>
              )
            })}
          </Flex>
        </Box>
      )}
    </Box>
  )
}

export default AIProviderStatus
