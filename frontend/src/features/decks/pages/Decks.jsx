import { useEffect, useState } from 'react'
import { VStack, HStack, Heading, Grid, Box, Text, Spinner, Button } from '@chakra-ui/react'
import { useDeckManagement } from '../hooks/useDeckManagement'
import { DeckCard } from '../components/DeckCard'
import { DeckCreateDialog } from '../components/DeckCreateDialog'
import { DeckEditorDrawer } from '../components/DeckEditorDrawer'
import { DeleteConfirmDialog } from '@components'

const Decks = () => {
  const {
    decks,
    loading,
    fetchDecks,
    createDeck,
    updateDeck,
    deleteDeck,
    fetchDeckCards,
    addCardToDeck,
    removeCardFromDeck,
    updateCardQuantity,
    getTotalCards,
    validateDeck,
  } = useDeckManagement()

  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const [editorDrawerOpen, setEditorDrawerOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [selectedDeck, setSelectedDeck] = useState(null)
  const [deckMetadata, setDeckMetadata] = useState({}) // Store totals and validation per deck

  useEffect(() => {
    fetchDecks()
  }, [])

  // Load metadata for each deck
  useEffect(() => {
    const loadMetadata = async () => {
      const metadata = {}
      for (const deck of decks) {
        const [total, validation] = await Promise.all([
          getTotalCards(deck.id),
          validateDeck(deck.id),
        ])
        metadata[deck.id] = { total, validation }
      }
      setDeckMetadata(metadata)
    }
    
    if (decks.length > 0) {
      loadMetadata()
    }
  }, [decks])

  const handleCreate = async (formData) => {
    await createDeck(formData)
  }

  const handleEdit = (deck) => {
    setSelectedDeck(deck)
    setEditorDrawerOpen(true)
  }

  const handleDelete = (deck) => {
    setSelectedDeck(deck)
    setDeleteDialogOpen(true)
  }

  const confirmDelete = async () => {
    if (selectedDeck) {
      await deleteDeck(selectedDeck.id)
      setDeleteDialogOpen(false)
      setSelectedDeck(null)
    }
  }

  const handleEditorClose = () => {
    setEditorDrawerOpen(false)
    setSelectedDeck(null)
    fetchDecks() // Refresh list when editor closes
  }

  return (
    <Box p={8}>
      <VStack align="stretch" gap={6}>
        <HStack justify="space-between">
          <Heading as="h1" size="xl">Decks</Heading>
          <Button colorPalette="blue" onClick={() => setCreateDialogOpen(true)}>
            Create New Deck
          </Button>
        </HStack>

        {loading ? (
          <Box textAlign="center" py={12}>
            <Spinner size="xl" />
          </Box>
        ) : decks.length === 0 ? (
          <Box
            p={8}
            borderWidth="1px"
            borderStyle="dashed"
            borderRadius="md"
            textAlign="center"
          >
            <Text color="fg.muted">Your decks will appear here</Text>
            <Text color="fg.muted" fontSize="sm" mt={2}>
              Click "Create New Deck" to get started
            </Text>
          </Box>
        ) : (
          <Grid templateColumns="repeat(auto-fill, minmax(300px, 1fr))" gap={4}>
            {decks.map((deck) => (
              <DeckCard
                key={deck.id}
                deck={deck}
                onEdit={handleEdit}
                onDelete={handleDelete}
                totalCards={deckMetadata[deck.id]?.total}
                validation={deckMetadata[deck.id]?.validation}
              />
            ))}
          </Grid>
        )}

        <DeckCreateDialog
          open={createDialogOpen}
          onClose={() => setCreateDialogOpen(false)}
          onCreate={handleCreate}
        />

        <DeckEditorDrawer
          open={editorDrawerOpen}
          onClose={handleEditorClose}
          deck={selectedDeck}
          onUpdate={updateDeck}
          onAddCard={addCardToDeck}
          onRemoveCard={removeCardFromDeck}
          onUpdateQuantity={updateCardQuantity}
          fetchDeckCards={fetchDeckCards}
          validateDeck={validateDeck}
        />

        <DeleteConfirmDialog
          isOpen={deleteDialogOpen}
          onClose={() => {
            setDeleteDialogOpen(false)
            setSelectedDeck(null)
          }}
          onConfirm={confirmDelete}
          entityType="deck"
        />
      </VStack>
    </Box>
  )
}

export default Decks
