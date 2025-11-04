import {
  Box,
  Button,
  Input,
  Textarea,
  Stack,
  Text,
} from '@chakra-ui/react'
import { Dialog } from '@chakra-ui/react'
import { NativeSelectRoot, NativeSelectField } from '@chakra-ui/react'

/**
 * PresetModal Component
 * 
 * Modal dialog for creating and editing preset entities. Dynamically renders different
 * form layouts based on the entity type and configuration.
 * 
 * Form Rendering Modes:
 * 1. Simple: Single field (name or description) for basic entities
 * 2. Archetype Form: Field + archetype selector for archetype-bound entities
 * 3. Effect Form: Complex form with name, description, archetype, and effect type
 * 
 * @param {boolean} isOpen - Whether the modal is visible
 * @param {Function} onClose - Callback to close the modal
 * @param {string} entityType - Display name of the entity
 * @param {string} fieldType - Type of field: 'name', 'description', or 'complex'
 * @param {Object} formData - Current form values
 * @param {Function} setFormData - Callback to update form values
 * @param {boolean} isEditing - Whether editing an existing entity (vs creating new)
 * @param {Function} onSave - Callback to save the entity
 * @param {Array} archetypes - Available archetypes for selection
 * @param {Array} effectTypes - Available effect types for Effects
 * @param {boolean} requiresArchetype - Whether entity requires archetype binding
 * @param {boolean} isEffect - Whether this is an Effect entity
 */
const PresetModal = ({ 
  isOpen, 
  onClose, 
  entityType, 
  fieldType, 
  formData, 
  setFormData, 
  isEditing, 
  onSave,
  archetypes = [],
  effectTypes = [],
  requiresArchetype = false,
  isEffect = false,
}) => {

  const getFieldLabel = () => {
    switch (fieldType) {
      case 'name':
        return 'Name'
      case 'description':
        return 'Description'
      case 'file_path':
        return 'File Path'
      default:
        return ''
    }
  }

  const handleChange = (field, value) => {
    setFormData({ ...formData, [field]: value })
  }

  const renderSimpleField = () => {
    const fieldName = fieldType === 'file_path' ? 'file_path' : fieldType
    
    return (
      <Box>
        <Text fontWeight="medium" mb={2}>{getFieldLabel()}</Text>
        {fieldType === 'description' ? (
          <Textarea
            value={formData[fieldName] || ''}
            onChange={(e) => handleChange(fieldName, e.target.value)}
            placeholder={`Enter ${fieldType}`}
          />
        ) : (
          <Input
            value={formData[fieldName] || ''}
            onChange={(e) => handleChange(fieldName, e.target.value)}
            placeholder={`Enter ${getFieldLabel().toLowerCase()}`}
          />
        )}
      </Box>
    )
  }

  const renderEffectForm = () => {
    return (
      <Stack gap={4}>
        <Box>
          <Text fontWeight="medium" mb={2}>Archetype *</Text>
          <NativeSelectRoot>
            <NativeSelectField
              value={formData.archetype_id || ''}
              onChange={(e) => handleChange('archetype_id', parseInt(e.target.value))}
              required
            >
              <option value="">Select Archetype</option>
              {archetypes.map(a => (
                <option key={a.id} value={a.id}>{a.name}</option>
              ))}
            </NativeSelectField>
          </NativeSelectRoot>
        </Box>

        <Box>
          <Text fontWeight="medium" mb={2}>Name *</Text>
          <Input
            value={formData.name || ''}
            onChange={(e) => handleChange('name', e.target.value)}
            placeholder="Enter effect name"
            required
          />
        </Box>

        <Box>
          <Text fontWeight="medium" mb={2}>Effect Type (Optional)</Text>
          <NativeSelectRoot>
            <NativeSelectField
              value={formData.effect_type_id || ''}
              onChange={(e) => handleChange('effect_type_id', e.target.value ? parseInt(e.target.value) : null)}
            >
              <option value="">None</option>
              {effectTypes.map(et => (
                <option key={et.id} value={et.id}>{et.name}</option>
              ))}
            </NativeSelectField>
          </NativeSelectRoot>
        </Box>

        <Box>
          <Text fontWeight="medium" mb={2}>Description *</Text>
          <Textarea
            value={formData.description || ''}
            onChange={(e) => handleChange('description', e.target.value)}
            placeholder="Enter detailed description"
            required
          />
        </Box>
      </Stack>
    )
  }

  const renderArchetypeForm = () => {
    return (
      <Stack gap={4}>
        <Box>
          <Text fontWeight="medium" mb={2}>Archetype *</Text>
          <NativeSelectRoot>
            <NativeSelectField
              value={formData.archetype_id || ''}
              onChange={(e) => handleChange('archetype_id', parseInt(e.target.value))}
              required
            >
              <option value="">Select Archetype</option>
              {archetypes.map(a => (
                <option key={a.id} value={a.id}>{a.name}</option>
              ))}
            </NativeSelectField>
          </NativeSelectRoot>
        </Box>
        {renderSimpleField()}
      </Stack>
    )
  }

  return (
    <Dialog.Root 
      open={isOpen} 
      onOpenChange={(e) => !e.open && onClose()}
      placement="center"
      size="md"
    >
      <Dialog.Backdrop />
      <Dialog.Positioner>
        <Dialog.Content>
          <Dialog.Header>
            <Dialog.Title>{isEditing ? 'Edit' : 'Create'} {entityType}</Dialog.Title>
          </Dialog.Header>
          <Dialog.Body>
            {isEffect ? renderEffectForm() : requiresArchetype ? renderArchetypeForm() : renderSimpleField()}
          </Dialog.Body>
          <Dialog.Footer>
            <Dialog.ActionTrigger asChild>
              <Button variant="outline">Cancel</Button>
            </Dialog.ActionTrigger>
            <Button colorPalette="blue" onClick={onSave}>
              Save
            </Button>
          </Dialog.Footer>
        </Dialog.Content>
      </Dialog.Positioner>
    </Dialog.Root>
  )
}

export default PresetModal
