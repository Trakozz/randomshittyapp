import { Box, Text, Stack, Badge, HStack, IconButton } from '@chakra-ui/react'
import { Controller } from 'react-hook-form'
import { Field } from '@/components/ui/field'
import {
  NativeSelectRoot,
  NativeSelectField,
} from '@/components/ui/native-select'

/**
 * CardEffectsFields Component
 * 
 * Form fields for selecting card effects (dropdown with multi-select)
 */
export const CardEffectsFields = ({ control, effects = [] }) => {
  return (
    <Box>
      <Text fontSize="lg" fontWeight="semibold" mb={4}>
        Effects
      </Text>
      <Field helperText="Select effects from the dropdown. Click badge × to remove.">
        <Controller
          name="effect_ids"
          control={control}
          render={({ field }) => {
            const selectedEffects = effects.filter((e) =>
              field.value?.includes(e.id)
            )

            return (
              <Stack gap={3}>
                {/* Dropdown to add effects */}
                <NativeSelectRoot>
                  <NativeSelectField
                    value=""
                    onChange={(e) => {
                      const effectId = Number(e.target.value)
                      if (effectId && !field.value?.includes(effectId)) {
                        const currentValues = field.value || []
                        field.onChange([...currentValues, effectId])
                      }
                      // Reset dropdown after selection
                      e.target.value = ''
                    }}
                  >
                    <option value="">+ Add Effect</option>
                    {effects.map((effect) => (
                      <option
                        key={effect.id}
                        value={effect.id}
                        disabled={field.value?.includes(effect.id)}
                      >
                        {effect.description}
                      </option>
                    ))}
                  </NativeSelectField>
                </NativeSelectRoot>

                {/* Display selected effects as badges */}
                {selectedEffects.length > 0 && (
                  <Stack gap={2}>
                    {selectedEffects.map((effect) => (
                      <HStack
                        key={effect.id}
                        justify="space-between"
                        p={2}
                        bg="bg.muted"
                        borderRadius="md"
                      >
                        <Box flex={1}>
                          <Text fontWeight="medium" fontSize="sm">
                            {effect.description}
                          </Text>
                        </Box>
                        <IconButton
                          size="sm"
                          variant="ghost"
                          colorPalette="red"
                          onClick={() => {
                            const currentValues = field.value || []
                            field.onChange(
                              currentValues.filter((id) => id !== effect.id)
                            )
                          }}
                          aria-label={`Remove effect`}
                        >
                          ×
                        </IconButton>
                      </HStack>
                    ))}
                  </Stack>
                )}
              </Stack>
            )
          }}
        />
      </Field>
    </Box>
  )
}
