import { Box, Heading, Text, VStack } from '@chakra-ui/react'

const Home = () => {
  return (
    <Box p={8}>
      <VStack spacing={4} align="start">
        <Heading as="h1" size="xl">Welcome to AscendanceV2</Heading>
        <Text fontSize="lg">
          A card game deck builder and management system.
        </Text>
        <Text>
          Use the navigation above to explore presets, browse cards, or build your decks.
        </Text>
      </VStack>
    </Box>
  )
}

export default Home
