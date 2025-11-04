import { Box, Heading, Text, VStack, Button, HStack } from '@chakra-ui/react'
import { useNavigate } from 'react-router-dom'

const Cards = () => {
  const navigate = useNavigate()
  
  return (
    <Box p={8}>
      <VStack spacing={6} align="start">
        <HStack justify="space-between" width="100%">
          <Heading as="h1" size="xl">Cards</Heading>
          <Button colorPalette="blue" onClick={() => navigate('/cards/create')}>
            Create New Card
          </Button>
        </HStack>
        
        <Text fontSize="lg" color="gray.600">
          Browse and manage all game cards
        </Text>

        <Box 
          p={8} 
          borderWidth={1} 
          borderRadius="lg" 
          borderStyle="dashed"
          borderColor="gray.300"
          width="100%"
          textAlign="center"
        >
          <Text color="gray.500">
            Card list and filters will be displayed here
          </Text>
        </Box>
      </VStack>
    </Box>
  )
}

export default Cards
