import { Box, Text, Stack, Badge, HStack, IconButton } from '@chakra-ui/react'
import { Controller } from 'react-hook-form'
import { Field } from '@/components/ui/field'
import {
  NativeSelectRoot,
  NativeSelectField,
} from '@/components/ui/native-select'

/**
 * CardBonusesFields Component
 * 
 * Form fields for selecting card bonuses (dropdown with multi-select)
 */
export const CardBonusesFields = ({ control, bonuses = [] }) => {
  return (
    <Box>
      <Text fontSize="lg" fontWeight="semibold" mb={4}>
        Bonuses
      </Text>
      <Field helperText="Select bonuses from the dropdown. Click badge × to remove.">
        <Controller
          name="bonus_ids"
          control={control}
          render={({ field }) => {
            const selectedBonuses = bonuses.filter((b) =>
              field.value?.includes(b.id)
            )

            return (
              <Stack gap={3}>
                {/* Dropdown to add bonuses */}
                <NativeSelectRoot>
                  <NativeSelectField
                    value=""
                    onChange={(e) => {
                      const bonusId = Number(e.target.value)
                      if (bonusId && !field.value?.includes(bonusId)) {
                        const currentValues = field.value || []
                        field.onChange([...currentValues, bonusId])
                      }
                      // Reset dropdown after selection
                      e.target.value = ''
                    }}
                  >
                    <option value="">+ Add Bonus</option>
                    {bonuses.map((bonus) => (
                      <option
                        key={bonus.id}
                        value={bonus.id}
                        disabled={field.value?.includes(bonus.id)}
                      >
                        {bonus.description}
                      </option>
                    ))}
                  </NativeSelectField>
                </NativeSelectRoot>

                {/* Display selected bonuses as badges */}
                {selectedBonuses.length > 0 && (
                  <Stack gap={2}>
                    {selectedBonuses.map((bonus) => (
                      <HStack
                        key={bonus.id}
                        justify="space-between"
                        p={2}
                        bg="bg.muted"
                        borderRadius="md"
                      >
                        <Box flex={1}>
                          <Text fontWeight="medium" fontSize="sm">
                            {bonus.description}
                          </Text>
                        </Box>
                        <IconButton
                          size="sm"
                          variant="ghost"
                          colorPalette="red"
                          onClick={() => {
                            const currentValues = field.value || []
                            field.onChange(
                              currentValues.filter((id) => id !== bonus.id)
                            )
                          }}
                          aria-label={`Remove bonus`}
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
