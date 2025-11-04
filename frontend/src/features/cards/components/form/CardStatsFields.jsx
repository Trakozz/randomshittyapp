import { Box, SimpleGrid, Text, Stack } from '@chakra-ui/react'
import { Controller } from 'react-hook-form'
import { Field } from '@/components/ui/field'
import {
  NumberInputRoot,
  NumberInputField,
} from '@/components/ui/number-input'

/**
 * CardStatsFields Component
 * 
 * Form fields for card statistics:
 * - Cost (required)
 * - Combat Power (required)
 * - Resilience (required)
 * - Max Occurrence (required)
 */
export const CardStatsFields = ({ control, errors }) => {
  return (
    <Stack gap={4}>
      <Text fontSize="lg" fontWeight="semibold">
        Card Statistics
      </Text>
      <SimpleGrid columns={{ base: 1, md: 2 }} gap={6}>
        {/* Cost */}
        <Field
          label="Cost"
          required
          invalid={!!errors.cost}
          errorText={errors.cost?.message}
          helperText="Knowledge required to play this card"
        >
          <Controller
            name="cost"
            control={control}
            rules={{
              required: 'Cost is required',
              min: { value: 0, message: 'Cost must be at least 0' },
            }}
            render={({ field }) => (
              <NumberInputRoot
                size="md"
                min={0}
                max={99}
                value={field.value}
                onValueChange={(e) => field.onChange(e.value)}
                width="full"
                useMobileStepper
                allowMouseWheel
              >
                <NumberInputField placeholder="0" />
              </NumberInputRoot>
            )}
          />
        </Field>

        {/* Combat Power */}
        <Field
          label="Combat Power"
          required
          invalid={!!errors.combat_power}
          errorText={errors.combat_power?.message}
          helperText="Combat power of the card"
        >
          <Controller
            name="combat_power"
            control={control}
            rules={{
              required: 'Combat power is required',
              min: { value: 0, message: 'Combat power must be at least 0' },
            }}
            render={({ field }) => (
              <NumberInputRoot
                size="md"
                min={0}
                max={99}
                value={field.value}
                onValueChange={(e) => field.onChange(e.value)}
                width="full"
                useMobileStepper
                allowMouseWheel
                colorPalette="purple"
              >
                <NumberInputField placeholder="0" />
              </NumberInputRoot>
            )}
          />
        </Field>

        {/* Resilience */}
        <Field
          label="Resilience"
          required
          invalid={!!errors.resilience}
          errorText={errors.resilience?.message}
          helperText="Defensive health points"
        >
          <Controller
            name="resilience"
            control={control}
            rules={{
              required: 'Resilience is required',
              min: { value: 0, message: 'Resilience must be at least 0' },
            }}
            render={({ field }) => (
              <NumberInputRoot
                size="md"
                min={0}
                max={99}
                value={field.value}
                onValueChange={(e) => field.onChange(e.value)}
                width="full"
                useMobileStepper
                allowMouseWheel
              >
                <NumberInputField placeholder="0" />
              </NumberInputRoot>
            )}
          />
        </Field>

        {/* Max Occurrence */}
        <Field
          label="Max Occurrence"
          required
          helperText="Maximum copies allowed in a deck (1-10)"
          invalid={!!errors.max_occurrence}
          errorText={errors.max_occurrence?.message}
        >
          <Controller
            name="max_occurrence"
            control={control}
            rules={{
              required: 'Max occurrence is required',
              min: { value: 1, message: 'Must allow at least 1 copy' },
            }}
            render={({ field }) => (
              <NumberInputRoot
                size="md"
                min={1}
                max={10}
                value={field.value}
                onValueChange={(e) => field.onChange(e.value)}
                width="full"
                useMobileStepper
                allowMouseWheel
              >
                <NumberInputField placeholder="1" />
              </NumberInputRoot>
            )}
          />
        </Field>
      </SimpleGrid>
    </Stack>
  )
}
