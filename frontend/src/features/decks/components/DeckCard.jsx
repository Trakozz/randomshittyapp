import { Card, Badge, HStack, VStack, Text, Button } from '@chakra-ui/react'
import { useNavigate } from 'react-router-dom'

export const DeckCard = ({ deck, onEdit, onDelete, totalCards, validation }) => {
  const navigate = useNavigate()
  const isValid = validation?.valid
  
  return (
    <Card.Root>
      <Card.Body>
        <VStack align="stretch" gap={3}>
          <HStack justify="space-between">
            <Card.Title>{deck.name}</Card.Title>
            <Badge colorPalette={isValid ? 'green' : 'red'}>
              {isValid ? 'Valid' : 'Invalid'}
            </Badge>
          </HStack>
          
          {deck.description && (
            <Card.Description>{deck.description}</Card.Description>
          )}
          
          <HStack gap={4} fontSize="sm" color="fg.muted">
            <Text>
              <strong>{totalCards || 0}</strong> cards
            </Text>
            {validation && !validation.valid && (
              <Text color="red.300">
                {validation.errors?.length || 0} issues
              </Text>
            )}
          </HStack>
          
          <HStack gap={2} mt={2}>
            <Button
              size="sm"
              colorPalette="teal"
              variant="outline"
              onClick={() => navigate(`/decks/${deck.id}`)}
              flex={1}
            >
              Details
            </Button>
            <Button
              size="sm"
              colorPalette="blue"
              variant="outline"
              onClick={() => onEdit(deck)}
              flex={1}
            >
              Edit
            </Button>
            <Button
              size="sm"
              colorPalette="red"
              variant="outline"
              onClick={() => onDelete(deck)}
            >
              Delete
            </Button>
          </HStack>
        </VStack>
      </Card.Body>
    </Card.Root>
  )
}
