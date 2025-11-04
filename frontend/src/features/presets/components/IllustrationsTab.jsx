import { useState, useEffect } from 'react'
import {
  Box,
  Button,
  VStack,
  HStack,
  Text,
  Image,
  SimpleGrid,
  Input,
  IconButton,
  SelectRoot,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValueText,
  createListCollection,
} from '@chakra-ui/react'
import { toaster } from '@/components/ui/toaster'
import { Dialog } from '@chakra-ui/react'
import { Field } from '@/components/ui/field'
import { ImageUploadField } from '@features/cards/components/form/ImageUploadField'
import { getApiUrl } from '@constants/api'

/**
 * IllustrationsTab Component
 * 
 * Specialized tab for managing illustration presets with image upload functionality.
 * Features:
 * - Upload new illustrations with archetype selection
 * - Filter illustrations by archetype
 * - View all uploaded illustrations in a grid
 * - Delete illustrations
 * - Preview images
 */
const IllustrationsTab = () => {
  const [illustrations, setIllustrations] = useState([])
  const [archetypes, setArchetypes] = useState([])
  const [selectedArchetype, setSelectedArchetype] = useState(null)
  const [uploadArchetype, setUploadArchetype] = useState(null)
  const [loading, setLoading] = useState(false)
  const [uploadModalOpen, setUploadModalOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [selectedIllustration, setSelectedIllustration] = useState(null)

  // Fetch archetypes
  const fetchArchetypes = async () => {
    try {
      const response = await fetch(getApiUrl('archetypes'))
      if (!response.ok) throw new Error('Failed to fetch archetypes')
      const data = await response.json()
      setArchetypes(data)
    } catch (error) {
      console.error('Error fetching archetypes:', error)
    }
  }

  // Fetch illustrations (with optional archetype filter)
  const fetchIllustrations = async (archetypeId = null) => {
    setLoading(true)
    try {
      const url = archetypeId
        ? `${getApiUrl('illustrations')}?archetype_id=${archetypeId}`
        : getApiUrl('illustrations')
      const response = await fetch(url)
      if (!response.ok) throw new Error('Failed to fetch illustrations')
      const data = await response.json()
      setIllustrations(data)
    } catch (error) {
      console.error('Error fetching illustrations:', error)
      toaster.create({
        title: 'Error',
        description: 'Failed to load illustrations',
        type: 'error',
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchArchetypes()
    fetchIllustrations()
  }, [])

  // Handle archetype filter change
  const handleArchetypeFilter = (value) => {
    const archetypeId = value === 'all' ? null : parseInt(value)
    setSelectedArchetype(archetypeId)
    fetchIllustrations(archetypeId)
  }

  // Handle upload modal open
  const handleUploadModalOpen = () => {
    setUploadArchetype(null)
    setUploadModalOpen(true)
  }

  // Handle upload complete
  const handleUploadComplete = (illustration) => {
    toaster.create({
      title: 'Success',
      description: 'Illustration uploaded successfully',
      type: 'success',
    })
    setUploadModalOpen(false)
    setUploadArchetype(null)
    fetchIllustrations(selectedArchetype) // Refresh the list
  }

  // Handle delete
  const handleDeleteClick = (illustration) => {
    setSelectedIllustration(illustration)
    setDeleteDialogOpen(true)
  }

  const handleDeleteConfirm = async () => {
    if (!selectedIllustration) return

    try {
      const response = await fetch(
        `${getApiUrl('illustrations')}/${selectedIllustration.id}`,
        { method: 'DELETE' }
      )

      if (!response.ok) throw new Error('Failed to delete illustration')

      toaster.create({
        title: 'Success',
        description: 'Illustration deleted successfully',
        type: 'success',
      })

      fetchIllustrations() // Refresh the list
    } catch (error) {
      console.error('Error deleting illustration:', error)
      toaster.create({
        title: 'Error',
        description: 'Failed to delete illustration',
        type: 'error',
      })
    } finally {
      setDeleteDialogOpen(false)
      setSelectedIllustration(null)
    }
  }

  return (
    <Box>
      {/* Header with Upload Button and Filter */}
      <VStack align="stretch" mb={6} gap={4}>
        <HStack justify="space-between">
          <Text fontSize="lg" fontWeight="semibold">
            Uploaded Illustrations
          </Text>
          <Button colorPalette="blue" onClick={handleUploadModalOpen}>
            + Upload New Illustration
          </Button>
        </HStack>
        
        {/* Archetype Filter */}
        <Field label="Filter by Archetype">
          <SelectRoot
            collection={createListCollection({
              items: [
                { value: 'all', label: 'All Archetypes' },
                ...archetypes.map(a => ({ value: a.id.toString(), label: a.name }))
              ]
            })}
            value={[selectedArchetype?.toString() || 'all']}
            onValueChange={(e) => handleArchetypeFilter(e.value[0])}
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
      </VStack>

      {/* Illustrations Grid */}
      {loading ? (
        <Text>Loading...</Text>
      ) : illustrations.length === 0 ? (
        <Box
          p={8}
          borderWidth="2px"
          borderStyle="dashed"
          borderColor="gray.300"
          borderRadius="md"
          textAlign="center"
        >
          <Text color="gray.500" mb={4}>
            No illustrations uploaded yet
          </Text>
          <Button colorPalette="blue" onClick={() => setUploadModalOpen(true)}>
            Upload Your First Illustration
          </Button>
        </Box>
      ) : (
        <SimpleGrid columns={{ base: 1, sm: 2, md: 3, lg: 4 }} gap={4}>
          {illustrations.map((illustration) => (
            <Box
              key={illustration.id}
              borderWidth="1px"
              borderRadius="lg"
              overflow="hidden"
              position="relative"
              _hover={{ boxShadow: 'lg' }}
              transition="box-shadow 0.2s"
            >
              {/* Image */}
              <Box h="200px" bg="gray.100" position="relative">
                <Image
                  src={`http://localhost:8000${illustration.url}`}
                  alt={illustration.original_name || illustration.filename}
                  objectFit="cover"
                  w="100%"
                  h="100%"
                />
              </Box>

              {/* Info */}
              <Box p={3}>
                <Text fontSize="sm" fontWeight="medium" noOfLines={1} mb={1}>
                  {illustration.original_name || illustration.filename}
                </Text>
                <Text fontSize="xs" color="gray.500" noOfLines={1}>
                  ID: {illustration.id}
                </Text>
              </Box>

              {/* Actions */}
              <HStack p={3} pt={0} gap={2}>
                <Button
                  size="sm"
                  variant="outline"
                  colorPalette="red"
                  onClick={() => handleDeleteClick(illustration)}
                  flex={1}
                >
                  Delete
                </Button>
              </HStack>
            </Box>
          ))}
        </SimpleGrid>
      )}

      {/* Upload Modal */}
      <Dialog.Root
        open={uploadModalOpen}
        onOpenChange={(e) => !e.open && setUploadModalOpen(false)}
        size="lg"
      >
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content>
            <Dialog.Header>
              <Dialog.Title>Upload New Illustration</Dialog.Title>
            </Dialog.Header>
            <Dialog.Body>
              <VStack gap={4} align="stretch">
                {/* Archetype Selection */}
                <Field label="Archetype" required>
                  <SelectRoot
                    collection={createListCollection({
                      items: archetypes.map(a => ({ value: a.id.toString(), label: a.name }))
                    })}
                    value={uploadArchetype ? [uploadArchetype.toString()] : []}
                    onValueChange={(e) => setUploadArchetype(parseInt(e.value[0]))}
                  >
                    <SelectTrigger>
                      <SelectValueText placeholder="Select archetype" />
                    </SelectTrigger>
                    <SelectContent>
                      {archetypes.map((archetype) => (
                        <SelectItem key={archetype.id} item={{ value: archetype.id.toString(), label: archetype.name }}>
                          {archetype.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </SelectRoot>
                </Field>

                {/* Image Upload */}
                {uploadArchetype && (
                  <ImageUploadField
                    onUploadComplete={handleUploadComplete}
                    setValue={() => {}} // Not needed for standalone upload
                    archetypeId={uploadArchetype}
                  />
                )}
              </VStack>
            </Dialog.Body>
            <Dialog.Footer>
              <Dialog.ActionTrigger asChild>
                <Button variant="outline">Close</Button>
              </Dialog.ActionTrigger>
            </Dialog.Footer>
          </Dialog.Content>
        </Dialog.Positioner>
      </Dialog.Root>

      {/* Delete Confirmation Dialog */}
      <Dialog.Root
        open={deleteDialogOpen}
        onOpenChange={(e) => !e.open && setDeleteDialogOpen(false)}
        role="alertdialog"
      >
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content>
            <Dialog.Header>
              <Dialog.Title>Delete Illustration</Dialog.Title>
            </Dialog.Header>
            <Dialog.Body>
              <Text>
                Are you sure you want to delete "{selectedIllustration?.original_name || 'this illustration'}"?
                This action cannot be undone.
              </Text>
            </Dialog.Body>
            <Dialog.Footer>
              <Dialog.ActionTrigger asChild>
                <Button variant="outline">Cancel</Button>
              </Dialog.ActionTrigger>
              <Button colorPalette="red" onClick={handleDeleteConfirm}>
                Delete
              </Button>
            </Dialog.Footer>
          </Dialog.Content>
        </Dialog.Positioner>
      </Dialog.Root>
    </Box>
  )
}

export default IllustrationsTab
