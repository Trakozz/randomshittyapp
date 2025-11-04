import { useEffect, useState } from 'react'
import {
  Drawer,
  Button,
  VStack,
  HStack,
  Input,
  Textarea,
  Text,
  Stack,
  Box,
  Badge,
  IconButton,
  Spinner,
} from '@chakra-ui/react'
import { FiTrash2, FiPlus, FiMinus } from 'react-icons/fi'

export const DeckEditorDrawer = ({
  open,
  onClose,
  deck,
  onUpdate,
  onAddCard,
  onRemoveCard,
  onUpdateQuantity,
  fetchDeckCards,
  validateDeck,
}) => {
  const [formData, setFormData] = useState({ name: '', description: '' })
  const [deckCards, setDeckCards] = useState([])
  const [validation, setValidation] = useState(null)
  const [loading, setLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (deck) {
      setFormData({ name: deck.name, description: deck.description || '' })
      loadDeckData()
    }
  }, [deck])

  const loadDeckData = async () => {
    if (!deck) return
    
    setLoading(true)
    try {
      const [cards, validationResult] = await Promise.all([
        fetchDeckCards(deck.id),
        validateDeck(deck.id),
      ])
      setDeckCards(cards)
      setValidation(validationResult)
    } catch (error) {
      console.error('Failed to load deck data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleUpdate = async () => {
    if (!formData.name.trim() || !deck) return
    
    setSubmitting(true)
    try {
      await onUpdate(deck.id, formData)
    } catch (error) {
      console.error('Failed to update deck:', error)
    } finally {
      setSubmitting(false)
    }
  }

  const handleQuantityChange = async (cardId, newQuantity) => {
    if (newQuantity < 1) return
    
    try {
      await onUpdateQuantity(deck.id, cardId, newQuantity)
      await loadDeckData() // Refresh
    } catch (error) {
      console.error('Failed to update quantity:', error)
    }
  }

  const handleRemoveCard = async (cardId) => {
    try {
      await onRemoveCard(deck.id, cardId)
      await loadDeckData() // Refresh
    } catch (error) {
      console.error('Failed to remove card:', error)
    }
  }

  const totalCards = deckCards.reduce((sum, card) => sum + card.quantity, 0)

  return (
    <Drawer.Root open={open} onOpenChange={(e) => !e.open && onClose()} size="lg" placement="end">
      <Drawer.Backdrop />
      <Drawer.Positioner>
        <Drawer.Content>
          <Drawer.Header>
            <Drawer.Title>Edit Deck</Drawer.Title>
          </Drawer.Header>
          
          <Drawer.Body>
            <VStack align="stretch" gap={6}>
              {/* Deck Info Section */}
              <Box>
                <Text fontSize="lg" fontWeight="semibold" mb={3}>
                  Deck Information
                </Text>
                <Stack gap={4}>
                  <Stack gap={2}>
                    <label htmlFor="edit-name">Name *</label>
                    <Input
                      id="edit-name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Enter deck name"
                    />
                  </Stack>
                  <Stack gap={2}>
                    <label htmlFor="edit-description">Description</label>
                    <Textarea
                      id="edit-description"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Enter deck description"
                      rows={3}
                    />
                  </Stack>
                  <Button
                    colorPalette="blue"
                    onClick={handleUpdate}
                    disabled={!formData.name.trim() || submitting}
                    loading={submitting}
                    alignSelf="flex-start"
                  >
                    Update Info
                  </Button>
                </Stack>
              </Box>

              {/* Validation Status */}
              <Box>
                <HStack justify="space-between" mb={3}>
                  <Text fontSize="lg" fontWeight="semibold">
                    Deck Status
                  </Text>
                  <Badge colorPalette={validation?.valid ? 'green' : 'red'} size="lg">
                    {validation?.valid ? 'Valid' : 'Invalid'}
                  </Badge>
                </HStack>
                <HStack gap={4} fontSize="sm">
                  <Text>
                    <strong>{totalCards}</strong> total cards
                  </Text>
                  <Text>
                    <strong>{deckCards.length}</strong> unique cards
                  </Text>
                </HStack>
                {validation && !validation.valid && validation.errors && (
                  <VStack align="stretch" mt={3} gap={2}>
                    {validation.errors.map((error, index) => (
                      <Text key={index} fontSize="sm" color="red.300">
                        • {error}
                      </Text>
                    ))}
                  </VStack>
                )}
              </Box>

              {/* Cards List */}
              <Box>
                <HStack justify="space-between" mb={3}>
                  <Text fontSize="lg" fontWeight="semibold">
                    Cards in Deck
                  </Text>
                  <Button size="sm" colorPalette="green" variant="outline">
                    <FiPlus /> Add Card
                  </Button>
                </HStack>
                
                {loading ? (
                  <HStack justify="center" py={8}>
                    <Spinner size="lg" />
                  </HStack>
                ) : deckCards.length === 0 ? (
                  <Box
                    p={8}
                    borderWidth="1px"
                    borderStyle="dashed"
                    borderRadius="md"
                    textAlign="center"
                  >
                    <Text color="fg.muted">No cards in this deck yet</Text>
                  </Box>
                ) : (
                  <VStack align="stretch" gap={2}>
                    {deckCards.map((deckCard) => (
                      <Box
                        key={deckCard.card.id}
                        p={3}
                        borderWidth="1px"
                        borderRadius="md"
                        bg="bg.muted"
                      >
                        <HStack justify="space-between">
                          <VStack align="start" gap={1} flex={1}>
                            <Text fontWeight="medium">{deckCard.card.name}</Text>
                            <HStack gap={2} fontSize="xs" color="fg.muted">
                              <Text>Cost: {deckCard.card.cost}</Text>
                              <Text>•</Text>
                              <Text>Power: {deckCard.card.combat_power}</Text>
                            </HStack>
                          </VStack>
                          
                          <HStack gap={2}>
                            <IconButton
                              size="sm"
                              variant="ghost"
                              onClick={() => handleQuantityChange(deckCard.card.id, deckCard.quantity - 1)}
                              disabled={deckCard.quantity <= 1}
                            >
                              <FiMinus />
                            </IconButton>
                            <Text minW="8" textAlign="center" fontWeight="semibold">
                              {deckCard.quantity}
                            </Text>
                            <IconButton
                              size="sm"
                              variant="ghost"
                              onClick={() => handleQuantityChange(deckCard.card.id, deckCard.quantity + 1)}
                              disabled={deckCard.quantity >= (deckCard.card.max_occurrence || 99)}
                            >
                              <FiPlus />
                            </IconButton>
                            <IconButton
                              size="sm"
                              colorPalette="red"
                              variant="ghost"
                              onClick={() => handleRemoveCard(deckCard.card.id)}
                            >
                              <FiTrash2 />
                            </IconButton>
                          </HStack>
                        </HStack>
                      </Box>
                    ))}
                  </VStack>
                )}
              </Box>
            </VStack>
          </Drawer.Body>
          
          <Drawer.Footer>
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
          </Drawer.Footer>
          
          <Drawer.CloseTrigger />
        </Drawer.Content>
      </Drawer.Positioner>
    </Drawer.Root>
  )
}
