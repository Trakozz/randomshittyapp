import { useState, useEffect } from 'react'
import { Dialog, Input, Stack, Textarea, Button, SelectRoot, SelectTrigger, SelectContent, SelectItem, SelectValueText, createListCollection } from '@chakra-ui/react'
import axios from 'axios'
import { getApiUrl } from '@constants/api'

export const DeckCreateDialog = ({ open, onClose, onCreate }) => {
  const [formData, setFormData] = useState({ name: '', description: '', archetype_id: '' })
  const [archetypes, setArchetypes] = useState([])
  const [submitting, setSubmitting] = useState(false)

  // Fetch archetypes when dialog opens
  useEffect(() => {
    if (open) {
      fetchArchetypes()
    }
  }, [open])

  const fetchArchetypes = async () => {
    try {
      const response = await axios.get(getApiUrl('archetypes'))
      setArchetypes(response.data)
    } catch (error) {
      console.error('Error fetching archetypes:', error)
    }
  }

  const archetypeCollection = createListCollection({
    items: archetypes.map(a => ({ label: a.name, value: a.id.toString() }))
  })

  const handleSubmit = async () => {
    if (!formData.name.trim() || !formData.archetype_id) return
    
    setSubmitting(true)
    try {
      // Convert archetype_id to number
      const deckData = {
        ...formData,
        archetype_id: parseInt(formData.archetype_id)
      }
      await onCreate(deckData)
      setFormData({ name: '', description: '', archetype_id: '' })
      onClose()
    } catch (error) {
      console.error('Failed to create deck:', error)
    } finally {
      setSubmitting(false)
    }
  }

  const handleClose = () => {
    setFormData({ name: '', description: '', archetype_id: '' })
    onClose()
  }

  return (
    <Dialog.Root open={open} onOpenChange={(e) => !e.open && handleClose()} size="md">
      <Dialog.Backdrop />
      <Dialog.Positioner>
        <Dialog.Content>
          <Dialog.Header>
            <Dialog.Title>Create New Deck</Dialog.Title>
          </Dialog.Header>
          <Dialog.Body>
            <Stack gap={4}>
              <Stack gap={2}>
                <label htmlFor="name">Name *</label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Enter deck name"
                />
              </Stack>
              <Stack gap={2}>
                <label htmlFor="archetype">Archetype *</label>
                <SelectRoot
                  collection={archetypeCollection}
                  value={formData.archetype_id ? [formData.archetype_id] : []}
                  onValueChange={(e) => setFormData({ ...formData, archetype_id: e.value[0] })}
                >
                  <SelectTrigger>
                    <SelectValueText placeholder="Select archetype" />
                  </SelectTrigger>
                  <SelectContent>
                    {archetypeCollection.items.map((archetype) => (
                      <SelectItem key={archetype.value} item={archetype}>
                        {archetype.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </SelectRoot>
              </Stack>
              <Stack gap={2}>
                <label htmlFor="description">Description</label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Enter deck description"
                  rows={4}
                />
              </Stack>
            </Stack>
          </Dialog.Body>
          <Dialog.Footer>
            <Button variant="outline" onClick={handleClose} disabled={submitting}>
              Cancel
            </Button>
            <Button
              colorPalette="blue"
              onClick={handleSubmit}
              disabled={!formData.name.trim() || !formData.archetype_id || submitting}
              loading={submitting}
            >
              Create
            </Button>
          </Dialog.Footer>
          <Dialog.CloseTrigger />
        </Dialog.Content>
      </Dialog.Positioner>
    </Dialog.Root>
  )
}
