import { Box, Text, Textarea } from '@chakra-ui/react'
import { Field } from '@/components/ui/field'

/**
 * CardDescriptionField Component
 * 
 * Form field for card description/flavor text
 * - Optional text area
 * - Character count helper
 * - Multi-line support
 */
export const CardDescriptionField = ({ register, errors }) => {
  return (
    <Box>
      <Text fontSize="lg" fontWeight="semibold" mb={4}>
        Description
      </Text>
      
      <Field
        label="Card Description"
        helperText="Optional flavor text or lore description (max 500 characters)"
        invalid={!!errors.description}
        errorText={errors.description?.message}
      >
        <Textarea
          {...register('description', {
            maxLength: {
              value: 500,
              message: 'Description must not exceed 500 characters',
            },
          })}
          placeholder="Enter card description or flavor text..."
          rows={4}
          resize="vertical"
        />
      </Field>
    </Box>
  )
}
