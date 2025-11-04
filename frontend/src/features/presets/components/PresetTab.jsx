import { useEffect } from 'react'
import { Box } from '@chakra-ui/react'
import PresetTable from './PresetTable'
import PresetModal from './PresetModal'
import { DeleteConfirmDialog } from '@components'
import { usePresetEntity } from '../hooks/usePresetEntity'

/**
 * PresetTab Component
 * 
 * Container component that orchestrates the display and management of a specific preset entity type.
 * Combines the table view, create/edit modal, and delete confirmation dialog.
 * 
 * @param {string} entityType - Display name of the entity (e.g., "Faction", "Effect")
 * @param {string} endpoint - API endpoint for CRUD operations (e.g., "factions", "effects")
 * @param {string} fieldType - Type of form field: 'name', 'description', or 'complex'
 * @param {boolean} requiresArchetype - Whether this entity must be bound to an archetype
 * @param {boolean} isEffect - Whether this is an Effect entity (enables special handling)
 * @param {boolean} isType - Whether this is a Type entity (enables icon upload)
 */
const PresetTab = ({ entityType, endpoint, fieldType, requiresArchetype = false, isEffect = false, isType = false }) => {
  // Use the preset entity hook to manage state and CRUD operations
  const {
    data,
    formData,
    setFormData,
    editingId,
    modalOpen,
    deleteDialogOpen,
    archetypes,
    effectTypes,
    fetchData,
    handleCreate,
    handleEdit,
    handleSave,
    handleDeleteClick,
    handleDeleteConfirm,
    closeModal,
    closeDeleteDialog,
  } = usePresetEntity(entityType, endpoint, fieldType, requiresArchetype, isEffect)

  // Fetch data when component mounts or when entity type changes (tab switch)
  useEffect(() => {
    fetchData()
  }, [entityType, endpoint])

  return (
    <Box>
      <PresetTable
        data={data}
        entityType={entityType}
        fieldType={fieldType}
        onEdit={handleEdit}
        onDelete={handleDeleteClick}
        onCreate={handleCreate}
        isEffect={isEffect}
        archetypes={archetypes}
        requiresArchetype={requiresArchetype}
        isType={isType}
      />

      <PresetModal
        isOpen={modalOpen}
        onClose={closeModal}
        entityType={entityType}
        fieldType={fieldType}
        formData={formData}
        setFormData={setFormData}
        isEditing={!!editingId}
        onSave={handleSave}
        archetypes={archetypes}
        effectTypes={effectTypes}
        requiresArchetype={requiresArchetype}
        isEffect={isEffect}
        isType={isType}
      />

      <DeleteConfirmDialog
        isOpen={deleteDialogOpen}
        onClose={closeDeleteDialog}
        entityType={entityType}
        onConfirm={handleDeleteConfirm}
      />
    </Box>
  )
}

export default PresetTab
