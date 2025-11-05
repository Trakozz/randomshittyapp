import { useState, useEffect } from 'react'
import {
  Dialog,
  Button,
  VStack,
  HStack,
  Input,
  Text,
  Box,
  Stack,
  Spinner,
  Badge,
} from '@chakra-ui/react'
import { LuSearch } from 'react-icons/lu'
import { FiPlus } from 'react-icons/fi'
import axios from 'axios'
import { getApiUrl } from '@constants/api'

export const AddCardDialog = ({ open, onClose, onAddCard, deckArchetypeId }) => {
  const [cards, setCards] = useState([])
  const [loading, setLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCard, setSelectedCard] = useState(null)
  const [quantity, setQuantity] = useState(1)

  useEffect(() => {
    if (open) {
      fetchCards()
      setSelectedCard(null)
      setQuantity(1)
      setSearchQuery('')
    }
  }, [open])

  const fetchCards = async () => {
    setLoading(true)
    try {
      const response = await axios.get(getApiUrl('cards'))
      setCards(response.data)
    } catch (error) {
      console.error('Failed to fetch cards:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredCards = cards.filter((card) => {
    const query = searchQuery.toLowerCase()
    return (
      card.name.toLowerCase().includes(query) ||
      (card.description && card.description.toLowerCase().includes(query))
    )
  })

  const handleAddCard = async () => {
    if (!selectedCard || quantity < 1) return

    try {
      await onAddCard(selectedCard.id, quantity)
      onClose()
    } catch (error) {
      console.error('Failed to add card:', error)
    }
  }

  return (
    <Dialog.Root open={open} onOpenChange={(e) => !e.open && onClose()} size="xl">
      <Dialog.Backdrop />
      <Dialog.Positioner>
        <Dialog.Content>
          <Dialog.Header>
            <Dialog.Title>Add Card to Deck</Dialog.Title>
          </Dialog.Header>
          
          <Dialog.Body>
          <VStack align="stretch" gap={4}>
            {/* Search Bar */}
            <HStack gap={2}>
              <Box position="relative" flex={1}>
                <Box
                  position="absolute"
                  left="3"
                  top="50%"
                  transform="translateY(-50%)"
                  color="fg.muted"
                >
                  <LuSearch />
                </Box>
                <Input
                  placeholder="Search cards..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  pl="10"
                />
              </Box>
            </HStack>

            {/* Card List */}
            <Box
              maxH="400px"
              overflowY="auto"
              borderWidth="1px"
              borderRadius="md"
              p={2}
            >
              {loading ? (
                <HStack justify="center" py={8}>
                  <Spinner size="lg" />
                </HStack>
              ) : filteredCards.length === 0 ? (
                <Box p={8} textAlign="center">
                  <Text color="fg.muted">
                    {searchQuery ? 'No cards found' : 'No cards available'}
                  </Text>
                </Box>
              ) : (
                <VStack align="stretch" gap={2}>
                  {filteredCards.map((card) => (
                    <Box
                      key={card.id}
                      p={3}
                      borderWidth="1px"
                      borderRadius="md"
                      cursor="pointer"
                      bg={selectedCard?.id === card.id ? 'blue.50' : 'bg.surface'}
                      borderColor={selectedCard?.id === card.id ? 'blue.500' : 'border'}
                      _hover={{ bg: selectedCard?.id === card.id ? 'blue.50' : 'bg.muted' }}
                      onClick={() => setSelectedCard(card)}
                    >
                      <HStack justify="space-between">
                        <VStack align="start" gap={1} flex={1}>
                          <HStack>
                            <Text fontWeight="medium">{card.name}</Text>
                            {card.archetype_id !== deckArchetypeId && (
                              <Badge colorPalette="orange" size="sm">
                                Different Archetype
                              </Badge>
                            )}
                          </HStack>
                          <HStack gap={3} fontSize="xs" color="fg.muted">
                            <Text>Cost: {card.cost}</Text>
                            <Text>•</Text>
                            <Text>Power: {card.combat_power}/{card.resilience}</Text>
                            <Text>•</Text>
                            <Text>Max: {card.max_occurrence}</Text>
                          </HStack>
                          {card.description && (
                            <Text fontSize="sm" color="fg.muted" noOfLines={2}>
                              {card.description}
                            </Text>
                          )}
                        </VStack>
                      </HStack>
                    </Box>
                  ))}
                </VStack>
              )}
            </Box>

            {/* Quantity Selector */}
            {selectedCard && (
              <Box p={4} borderWidth="1px" borderRadius="md" bg="bg.muted">
                <VStack align="stretch" gap={3}>
                  <Text fontWeight="semibold">Selected: {selectedCard.name}</Text>
                  <Stack gap={2}>
                    <label htmlFor="quantity">Quantity</label>
                    <Input
                      id="quantity"
                      type="number"
                      min={1}
                      max={selectedCard.max_occurrence}
                      value={quantity}
                      onChange={(e) => setQuantity(Math.max(1, Math.min(selectedCard.max_occurrence, parseInt(e.target.value) || 1)))}
                    />
                    <Text fontSize="sm" color="fg.muted">
                      Max allowed: {selectedCard.max_occurrence}
                    </Text>
                  </Stack>
                </VStack>
              </Box>
            )}
          </VStack>
          </Dialog.Body>
          
          <Dialog.Footer>
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button
              colorPalette="green"
              onClick={handleAddCard}
              disabled={!selectedCard || quantity < 1}
            >
              <FiPlus /> Add Card
            </Button>
          </Dialog.Footer>
          
          <Dialog.CloseTrigger />
        </Dialog.Content>
      </Dialog.Positioner>
    </Dialog.Root>
  )
}
