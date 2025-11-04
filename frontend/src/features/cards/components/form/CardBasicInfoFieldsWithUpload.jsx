import { Input, Stack, Text, SimpleGrid, Button, FileUpload } from '@chakra-ui/react'
import { HiUpload } from 'react-icons/hi'
import { Field } from '@/components/ui/field'
import {
  NativeSelectRoot,
  NativeSelectField,
} from '@/components/ui/native-select'

/**
 * CardBasicInfoFields Component
 * 
 * Form fields for basic card information with optional image upload:
 * - Card Name (required)
 * - Archetype (optional)
 * - Type (optional)
 * - Faction (optional)
 * - Illustration (optional - can select existing or upload new)
 */
export const CardBasicInfoFieldsWithUpload = ({
  register,
  errors,
  setValue,
  archetypes = [],
  types = [],
  factions = [],
  illustrations = [],
}) => {
  const handleFileChange = async (details) => {
    const file = details.acceptedFiles?.[0]
    if (!file) return

    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch('http://localhost:8000/api/v1/illustrations/upload', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        throw new Error('Upload failed')
      }

      const illustration = await response.json()
      setValue('illustration_id', illustration.id)
      console.log('Upload successful:', illustration)
    } catch (error) {
      console.error('Upload error:', error)
    }
  }

  return (
    <Stack gap={4}>
      <Text fontSize="lg" fontWeight="semibold">
        Basic Information
      </Text>

      {/* Card Name - Full Width */}
      <Field
        label="Card Name"
        required
        invalid={!!errors.name}
        errorText={errors.name?.message}
      >
        <Input
          {...register('name', {
            required: 'Card name is required',
            minLength: {
              value: 2,
              message: 'Name must be at least 2 characters',
            },
          })}
          placeholder="Enter card name"
        />
      </Field>

      {/* Two Column Grid for Selects */}
      <SimpleGrid columns={{ base: 1, md: 2 }} gap={6}>
        {/* Archetype Selection */}
        <Field
          label="Archetype"
          helperText="Select the card's archetype"
        >
          <NativeSelectRoot>
            <NativeSelectField
              {...register('archetype_id')}
              placeholder="Select archetype"
            >
              <option value="">None</option>
              {archetypes.map((archetype) => (
                <option key={archetype.id} value={archetype.id}>
                  {archetype.name}
                </option>
              ))}
            </NativeSelectField>
          </NativeSelectRoot>
        </Field>

        {/* Type Selection */}
        <Field label="Type" helperText="Select the card's type">
          <NativeSelectRoot>
            <NativeSelectField
              {...register('type_id')}
              placeholder="Select type"
            >
              <option value="">None</option>
              {types.map((type) => (
                <option key={type.id} value={type.id}>
                  {type.name}
                </option>
              ))}
            </NativeSelectField>
          </NativeSelectRoot>
        </Field>

        {/* Faction Selection */}
        <Field label="Faction" helperText="Select the card's faction">
          <NativeSelectRoot>
            <NativeSelectField
              {...register('faction_id')}
              placeholder="Select faction"
            >
              <option value="">None</option>
              {factions.map((faction) => (
                <option key={faction.id} value={faction.id}>
                  {faction.name}
                </option>
              ))}
            </NativeSelectField>
          </NativeSelectRoot>
        </Field>

        {/* Illustration - Upload or Select */}
        <Field label="Illustration" helperText="Upload image or select existing">
          <Stack gap={2}>
            <FileUpload.Root
              accept={{
                'image/*': ['.jpg', '.jpeg', '.png', '.gif', '.webp']
              }}
              maxFiles={1}
              maxFileSize={10 * 1024 * 1024}
              onFileChange={handleFileChange}
            >
              <FileUpload.HiddenInput />
              <FileUpload.Trigger asChild>
                <Button variant="outline" size="sm">
                  <HiUpload /> Upload file
                </Button>
              </FileUpload.Trigger>
              <FileUpload.ItemGroup />
            </FileUpload.Root>

            <NativeSelectRoot>
              <NativeSelectField
                {...register('illustration_id')}
                placeholder="Or select existing"
              >
                <option value="">None</option>
                {illustrations.map((illustration) => (
                  <option key={illustration.id} value={illustration.id}>
                    {illustration.original_name || illustration.filename}
                  </option>
                ))}
              </NativeSelectField>
            </NativeSelectRoot>
          </Stack>
        </Field>
      </SimpleGrid>
    </Stack>
  )
}
