import { useEffect, useState, useMemo } from 'react'
import { Box, Heading, Text, VStack, Button, HStack, Table, Spinner, SelectRoot, SelectTrigger, SelectContent, SelectItem, SelectValueText, createListCollection, Input } from '@chakra-ui/react'
import { useNavigate } from 'react-router-dom'
import { Field } from '@/components/ui/field'
import { LuSearch } from 'react-icons/lu'
import axios from 'axios'
import { getApiUrl } from '@constants/api'

const Cards = () => {
  const navigate = useNavigate()
  const [cards, setCards] = useState([])
  const [archetypes, setArchetypes] = useState([])
  const [selectedArchetype, setSelectedArchetype] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchArchetypes()
  }, [])

  useEffect(() => {
    if (selectedArchetype) {
      fetchCards(selectedArchetype)
    }
  }, [selectedArchetype])

  const fetchArchetypes = async () => {
    try {
      const response = await axios.get(getApiUrl('archetypes'))
      setArchetypes(response.data)
      // Auto-select first archetype if available
      if (response.data.length > 0) {
        setSelectedArchetype(response.data[0].id.toString())
      }
    } catch (err) {
      console.error('Error fetching archetypes:', err)
      setError('Failed to load archetypes')
    }
  }

  const fetchCards = async (archetypeId) => {
    try {
      setLoading(true)
      const response = await axios.get(getApiUrl('cards'), {
        params: { archetype_id: archetypeId }
      })
      setCards(response.data)
      setError(null)
    } catch (err) {
      console.error('Error fetching cards:', err)
      setError('Failed to load cards')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (cardId) => {
    if (!window.confirm('Are you sure you want to delete this card?')) {
      return
    }

    try {
      await axios.delete(getApiUrl(`cards/${cardId}`))
      fetchCards(selectedArchetype) // Refresh the list
    } catch (err) {
      console.error('Error deleting card:', err)
      alert('Failed to delete card')
    }
  }

  const archetypeCollection = createListCollection({
    items: archetypes.map(archetype => ({
      label: archetype.name,
      value: archetype.id.toString()
    }))
  })

  // Filter cards based on search query
  const filteredCards = useMemo(() => {
    if (!searchQuery.trim()) return cards
    
    const query = searchQuery.toLowerCase()
    return cards.filter(card => 
      card.name.toLowerCase().includes(query) ||
      card.description?.toLowerCase().includes(query)
    )
  }, [cards, searchQuery])
  
  return (
    <Box p={8}>
      <VStack spacing={6} align="start" width="100%">
        <HStack justify="space-between" width="100%">
          <Heading as="h1" size="xl">Cards</Heading>
          <Button colorPalette="blue" onClick={() => navigate('/cards/create')}>
            Create New Card
          </Button>
        </HStack>
        
        <Text fontSize="lg" color="gray.600">
          Browse and manage cards by archetype
        </Text>

        {/* Filters */}
        <HStack width="100%" gap={4}>
          <Field label="Filter by Archetype" flex="1" maxW="300px">
            <SelectRoot
              collection={archetypeCollection}
              value={[selectedArchetype]}
              onValueChange={(e) => setSelectedArchetype(e.value[0])}
            >
              <SelectTrigger>
                <SelectValueText placeholder="Select an archetype" />
              </SelectTrigger>
              <SelectContent>
                {archetypes.map((archetype) => (
                  <SelectItem key={archetype.id} item={archetype.id.toString()}>
                    {archetype.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </SelectRoot>
          </Field>

          <Field label="Search Cards" flex="1" maxW="400px">
            <HStack>
              <Box color="gray.500">
                <LuSearch />
              </Box>
              <Input
                placeholder="Search by name or description..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </HStack>
          </Field>
        </HStack>

        {loading ? (
          <Box width="100%" textAlign="center" py={8}>
            <Spinner size="xl" />
          </Box>
        ) : error ? (
          <Box width="100%" textAlign="center" py={8}>
            <Text color="red.500">{error}</Text>
          </Box>
        ) : filteredCards.length === 0 ? (
          <Box 
            p={8} 
            borderWidth={1} 
            borderRadius="lg" 
            borderStyle="dashed"
            borderColor="gray.300"
            width="100%"
            textAlign="center"
          >
            <Text color="gray.500" mb={4}>
              {cards.length === 0 
                ? 'No cards found in this archetype. Create your first card!'
                : 'No cards match your search query.'}
            </Text>
            {cards.length === 0 && (
              <Button colorPalette="blue" onClick={() => navigate('/cards/create')}>
                Create Card
              </Button>
            )}
          </Box>
        ) : (
          <Table.Root size="sm" variant="outline" width="100%">
            <Table.Header>
              <Table.Row>
                <Table.ColumnHeader>ID</Table.ColumnHeader>
                <Table.ColumnHeader>Name</Table.ColumnHeader>
                <Table.ColumnHeader>Cost</Table.ColumnHeader>
                <Table.ColumnHeader>Combat Power</Table.ColumnHeader>
                <Table.ColumnHeader>Resilience</Table.ColumnHeader>
                <Table.ColumnHeader>Max Occurrence</Table.ColumnHeader>
                <Table.ColumnHeader>Actions</Table.ColumnHeader>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {filteredCards.map((card) => (
                <Table.Row key={card.id}>
                  <Table.Cell>{card.id}</Table.Cell>
                  <Table.Cell fontWeight="medium">{card.name}</Table.Cell>
                  <Table.Cell>{card.cost}</Table.Cell>
                  <Table.Cell>{card.combat_power}</Table.Cell>
                  <Table.Cell>{card.resilience}</Table.Cell>
                  <Table.Cell>{card.max_occurrence}</Table.Cell>
                  <Table.Cell>
                    <HStack gap={2}>
                      <Button
                        size="sm"
                        colorPalette="blue"
                        variant="ghost"
                        onClick={() => navigate(`/cards/edit/${card.id}`)}
                      >
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        colorPalette="red"
                        variant="ghost"
                        onClick={() => handleDelete(card.id)}
                      >
                        Delete
                      </Button>
                    </HStack>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table.Root>
        )}
      </VStack>
    </Box>
  )
}

export default Cards
