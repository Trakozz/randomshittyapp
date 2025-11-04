import { useState, useEffect, useMemo } from 'react'
import { Box, Button, Table, HStack, VStack, Text, Image, SelectRoot, SelectTrigger, SelectContent, SelectItem, SelectValueText, createListCollection, Input } from '@chakra-ui/react'
import { Field } from '@/components/ui/field'
import { LuSearch } from 'react-icons/lu'
import { API_BASE_URL } from '@constants/api'

/**
 * PresetTable Component
 * 
 * Displays a table of preset entities with CRUD actions. Supports optional archetype filtering
 * for entities that require archetype binding.
 * 
 * Features:
 * - Dynamic columns based on entity type and configuration
 * - Archetype filter dropdown for archetype-bound entities
 * - Client-side filtering by archetype
 * - Special handling for Effect entities (shows name + description columns)
 * 
 * @param {Array} data - Array of entity objects to display
 * @param {string} entityType - Display name of the entity
 * @param {string} fieldType - Type of primary field: 'name', 'description', 'file_path', or 'complex'
 * @param {Function} onEdit - Callback when edit button is clicked
 * @param {Function} onDelete - Callback when delete button is clicked
 * @param {Function} onCreate - Callback when create button is clicked
 * @param {boolean} isEffect - Whether displaying Effect entities (adds description column)
 * @param {Array} archetypes - Array of archetype objects for filtering
 * @param {boolean} requiresArchetype - Whether this entity type requires archetype binding
 * @param {Array} effectTypes - Array of effect type objects for displaying effect type names
 */
const PresetTable = ({ 
  data, 
  entityType, 
  fieldType, 
  onEdit, 
  onDelete, 
  onCreate, 
  isEffect = false,
  archetypes = [],
  requiresArchetype = false,
  isType = false,
  effectTypes = []
}) => {
  const [selectedArchetype, setSelectedArchetype] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')

  // Reset filter and search when switching between different entity types (tabs)
  useEffect(() => {
    setSelectedArchetype('all')
    setSearchQuery('')
  }, [entityType])

  const getArchetypeName = (archetypeId) => {
    const archetype = archetypes.find(a => a.id === archetypeId)
    return archetype ? archetype.name : 'N/A'
  }

  const getEffectTypeName = (effectTypeId) => {
    if (!effectTypeId) return 'N/A'
    const effectType = effectTypes.find(et => et.id === effectTypeId)
    return effectType ? effectType.name : 'N/A'
  }

  const getFieldValue = (item) => {
    switch (fieldType) {
      case 'name':
        return item.name
      case 'description':
        return item.description
      case 'file_path':
        return item.file_path
      case 'complex':
        // For effects, show name
        return item.name || item.description
      default:
        return ''
    }
  }

  const getFieldLabel = () => {
    switch (fieldType) {
      case 'name':
        return 'Name'
      case 'description':
        return 'Description'
      case 'file_path':
        return 'File Path'
      case 'complex':
        return isEffect ? 'Name' : 'Value'
      default:
        return ''
    }
  }

  // Show archetype column if archetypes are provided and entity requires archetype
  const showArchetypeColumn = requiresArchetype && archetypes.length > 0

  // Filter data by selected archetype
  const archetypeFilteredData = selectedArchetype === 'all' 
    ? data 
    : data.filter(item => item.archetype_id === parseInt(selectedArchetype))

  // Filter data by search query
  const filteredData = useMemo(() => {
    if (!searchQuery.trim()) return archetypeFilteredData
    
    const query = searchQuery.toLowerCase()
    return archetypeFilteredData.filter(item => {
      // Search in name field
      if (item.name && item.name.toLowerCase().includes(query)) return true
      // Search in description field
      if (item.description && item.description.toLowerCase().includes(query)) return true
      return false
    })
  }, [archetypeFilteredData, searchQuery])

  return (
    <VStack align="stretch" gap={4}>
      {/* Header with Create Button and Filter */}
      <HStack justify="space-between">
        <Button colorPalette="blue" onClick={onCreate}>
          Create New {entityType}
        </Button>
        
        {/* Filters */}
        <HStack gap={4}>
          {/* Archetype Filter (only show if entity requires archetype) */}
          {showArchetypeColumn && (
            <Box width="250px">
              <Field label="Filter by Archetype">
                <SelectRoot
                  collection={createListCollection({
                    items: [
                      { value: 'all', label: 'All Archetypes' },
                      ...archetypes.map(a => ({ value: a.id.toString(), label: a.name }))
                    ]
                  })}
                  value={[selectedArchetype]}
                  onValueChange={(e) => setSelectedArchetype(e.value[0])}
                  size="sm"
                >
                  <SelectTrigger>
                    <SelectValueText placeholder="Select archetype" />
                  </SelectTrigger>
                  <SelectContent>
                    {[
                      { value: 'all', label: 'All Archetypes' },
                      ...archetypes.map(a => ({ value: a.id.toString(), label: a.name }))
                    ].map((option) => (
                      <SelectItem key={option.value} item={option}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </SelectRoot>
              </Field>
            </Box>
          )}

          {/* Search Bar (show for effects and other entities with name/description) */}
          {(isEffect || fieldType === 'name' || fieldType === 'description') && (
            <Box width="300px">
              <Field label="Search">
                <HStack>
                  <Box color="gray.500">
                    <LuSearch />
                  </Box>
                  <Input
                    placeholder={`Search ${entityType.toLowerCase()}s...`}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    size="sm"
                  />
                </HStack>
              </Field>
            </Box>
          )}
        </HStack>
      </HStack>

      {/* Table */}
      <Table.Root size="sm" variant="outline">
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeader>ID</Table.ColumnHeader>
            {isType && <Table.ColumnHeader>Icon</Table.ColumnHeader>}
            <Table.ColumnHeader>{getFieldLabel()}</Table.ColumnHeader>
            {showArchetypeColumn && (
              <Table.ColumnHeader>Archetype</Table.ColumnHeader>
            )}
            {isEffect && (
              <>
                <Table.ColumnHeader>Description</Table.ColumnHeader>
                <Table.ColumnHeader>Effect Type</Table.ColumnHeader>
              </>
            )}
            <Table.ColumnHeader width="150px">Actions</Table.ColumnHeader>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {filteredData.length === 0 ? (
            <Table.Row>
              <Table.Cell colSpan={showArchetypeColumn ? (isEffect ? 6 : 4) : (isEffect ? 5 : 3)}>
                <Text textAlign="center" color="gray.500" py={4}>
                  No {entityType.toLowerCase()}s found
                </Text>
              </Table.Cell>
            </Table.Row>
          ) : (
            filteredData.map((item) => (
              <Table.Row key={item.id}>
                <Table.Cell>{item.id}</Table.Cell>
                {isType && (
                  <Table.Cell>
                    {item.icon_path ? (
                      <Image
                        src={`${API_BASE_URL}/types/icon/${item.icon_path.split('/').pop()}`}
                        alt={`${item.name} icon`}
                        boxSize="32px"
                        objectFit="contain"
                      />
                    ) : (
                      <Text fontSize="xs" color="gray.500">No icon</Text>
                    )}
                  </Table.Cell>
                )}
                <Table.Cell>{getFieldValue(item)}</Table.Cell>
                {showArchetypeColumn && (
                  <Table.Cell>{getArchetypeName(item.archetype_id)}</Table.Cell>
                )}
                {isEffect && (
                  <>
                    <Table.Cell>{item.description || 'N/A'}</Table.Cell>
                    <Table.Cell>{getEffectTypeName(item.effect_type_id)}</Table.Cell>
                  </>
                )}
                <Table.Cell>
                  <HStack gap={2}>
                    <Button
                      size="sm"
                      colorPalette="blue"
                      variant="ghost"
                      onClick={() => onEdit(item)}
                    >
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      colorPalette="red"
                      variant="ghost"
                      onClick={() => onDelete(item)}
                    >
                      Delete
                    </Button>
                  </HStack>
                </Table.Cell>
              </Table.Row>
            ))
          )}
        </Table.Body>
      </Table.Root>
    </VStack>
  )
}

export default PresetTable
