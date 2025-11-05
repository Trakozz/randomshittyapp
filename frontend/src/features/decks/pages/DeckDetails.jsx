import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Box, Heading, Text, VStack, HStack, Button, Spinner, Grid, GridItem, Badge, Flex } from '@chakra-ui/react'
import { Chart, useChart } from '@chakra-ui/charts'
import { Bar, BarChart, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Pie, PieChart, Cell } from 'recharts'
import axios from 'axios'
import { getApiUrl } from '@shared/constants/api'
import { CardFormPreview } from '@features/cards/components/CardFormPreview'

const DeckDetails = () => {
  const { deckId } = useParams()
  const navigate = useNavigate()
  const [deck, setDeck] = useState(null)
  const [cards, setCards] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchDeckDetails()
  }, [deckId])

  const fetchDeckDetails = async () => {
    try {
      setLoading(true)
      // Fetch deck details
      const deckResponse = await axios.get(getApiUrl(`decks/${deckId}`))
      setDeck(deckResponse.data)

      // Fetch all cards for this deck
      const cardsResponse = await axios.get(getApiUrl(`decks/${deckId}/cards`))
      setCards(cardsResponse.data)
      
      setError(null)
    } catch (err) {
      console.error('Error fetching deck details:', err)
      setError('Failed to load deck details')
    } finally {
      setLoading(false)
    }
  }

  // Calculate statistics
  const totalCards = cards.reduce((sum, deckCard) => sum + (deckCard.quantity || 0), 0)
  const stats = {
    totalCards,
    uniqueCards: cards.length,
    averageCost: totalCards > 0 
      ? (cards.reduce((sum, deckCard) => sum + (deckCard.card.cost || 0) * (deckCard.quantity || 0), 0) / totalCards).toFixed(2)
      : 0,
  }

  // Cost distribution data
  const costDistribution = cards.reduce((acc, deckCard) => {
    const cost = deckCard.card.cost || 0
    const existing = acc.find(item => item.cost === cost)
    if (existing) {
      existing.count += deckCard.quantity || 0
    } else {
      acc.push({ cost, count: deckCard.quantity || 0 })
    }
    return acc
  }, []).sort((a, b) => a.cost - b.cost)

  const costChart = useChart({
    data: costDistribution.map(item => ({
      name: `Cost ${item.cost}`,
      count: item.count,
    })),
    series: [{ name: 'count', color: 'blue.500' }],
  })

  // Type distribution data
  const typeDistribution = cards.reduce((acc, deckCard) => {
    const typeName = deckCard.card.type?.name || 'Unknown'
    const existing = acc.find(item => item.type === typeName)
    if (existing) {
      existing.count += deckCard.quantity || 0
    } else {
      acc.push({ type: typeName, count: deckCard.quantity || 0 })
    }
    return acc
  }, [])

  const typeChart = useChart({
    data: typeDistribution.map(item => ({
      name: item.type,
      value: item.count,
    })),
  })

  // Archetype distribution data
  const archetypeDistribution = cards.reduce((acc, deckCard) => {
    const archetypeName = deckCard.card.archetype?.name || 'Unknown'
    const existing = acc.find(item => item.archetype === archetypeName)
    if (existing) {
      existing.count += deckCard.quantity || 0
    } else {
      acc.push({ archetype: archetypeName, count: deckCard.quantity || 0 })
    }
    return acc
  }, [])

  const archetypeChart = useChart({
    data: archetypeDistribution.map(item => ({
      name: item.archetype,
      value: item.count,
    })),
  })

  // Colors for pie charts
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82ca9d', '#ffc658']

  if (loading) {
    return (
      <Box p={8} textAlign="center">
        <Spinner size="xl" />
      </Box>
    )
  }

  if (error || !deck) {
    return (
      <Box p={8}>
        <Text color="red.500">{error || 'Deck not found'}</Text>
        <Button mt={4} onClick={() => navigate('/decks')}>
          Back to Decks
        </Button>
      </Box>
    )
  }

  return (
    <Box p={8}>
      <VStack align="start" spacing={6} width="100%">
        {/* Header */}
        <HStack justify="space-between" width="100%">
          <VStack align="start" spacing={1}>
            <Heading as="h1" size="xl">{deck.name}</Heading>
            {deck.description && (
              <Text color="gray.600">{deck.description}</Text>
            )}
          </VStack>
          <Button onClick={() => navigate('/decks')}>
            Back to Decks
          </Button>
        </HStack>

        {/* Quick Stats */}
        <Grid templateColumns="repeat(4, 1fr)" gap={4} width="100%">
          <GridItem>
            <Box p={4} borderWidth="1px" borderRadius="lg">
              <Text fontSize="sm" color="gray.600">Total Cards</Text>
              <Text fontSize="2xl" fontWeight="bold">{stats.totalCards}</Text>
            </Box>
          </GridItem>
          <GridItem>
            <Box p={4} borderWidth="1px" borderRadius="lg">
              <Text fontSize="sm" color="gray.600">Unique Cards</Text>
              <Text fontSize="2xl" fontWeight="bold">{stats.uniqueCards}</Text>
            </Box>
          </GridItem>
          <GridItem>
            <Box p={4} borderWidth="1px" borderRadius="lg">
              <Text fontSize="sm" color="gray.600">Average Cost</Text>
              <Text fontSize="2xl" fontWeight="bold">{stats.averageCost}</Text>
            </Box>
          </GridItem>
          <GridItem>
            <Box p={4} borderWidth="1px" borderRadius="lg">
              <Text fontSize="sm" color="gray.600">Archetype</Text>
              <Text fontSize="xl" fontWeight="bold">{deck.archetype?.name || 'N/A'}</Text>
            </Box>
          </GridItem>
        </Grid>

        {/* Charts */}
        <Grid templateColumns="repeat(2, 1fr)" gap={6} width="100%">
          {/* Cost Distribution */}
          <GridItem>
            <Box p={4} borderWidth="1px" borderRadius="lg">
              <Heading size="md" mb={4}>Cost Distribution</Heading>
              <Chart.Root chart={costChart} height="300px">
                <BarChart data={costChart.data}>
                  <CartesianGrid stroke={costChart.color('border.muted')} strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  {costChart.series.map((item) => (
                    <Bar
                      key={item.name}
                      dataKey={costChart.key(item.name)}
                      fill={costChart.color(item.color)}
                    />
                  ))}
                </BarChart>
              </Chart.Root>
            </Box>
          </GridItem>

          {/* Type Distribution */}
          <GridItem>
            <Box p={4} borderWidth="1px" borderRadius="lg">
              <Heading size="md" mb={4}>Type Distribution</Heading>
              <Chart.Root chart={typeChart} height="300px">
                <PieChart>
                  <Pie
                    data={typeChart.data}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    label
                  >
                    {typeChart.data.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </Chart.Root>
            </Box>
          </GridItem>

          {/* Archetype Distribution */}
          {archetypeDistribution.length > 0 && (
            <GridItem>
              <Box p={4} borderWidth="1px" borderRadius="lg">
                <Heading size="md" mb={4}>Archetype Distribution</Heading>
                <Chart.Root chart={archetypeChart} height="300px">
                  <PieChart>
                    <Pie
                      data={archetypeChart.data}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      label
                    >
                      {archetypeChart.data.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </Chart.Root>
              </Box>
            </GridItem>
          )}
        </Grid>

        {/* Cards Section */}
        <Box mt={8}>
          <Heading size="lg" mb={4}>Cards in Deck</Heading>
          {cards.length === 0 ? (
            <Box
              p={8}
              borderWidth="1px"
              borderStyle="dashed"
              borderRadius="md"
              textAlign="center"
            >
              <Text color="gray.500">No cards in this deck yet</Text>
            </Box>
          ) : (
            <Flex
              wrap="wrap"
              gap={6}
              width="100%"
            >
              {cards.map((deckCard) => (
                <Box key={deckCard.card.id} position="relative" flexShrink={0}>
                  {/* Quantity Badge */}
                  <Badge
                    position="absolute"
                    top={2}
                    right={2}
                    zIndex={10}
                    colorPalette="blue"
                    size="lg"
                    px={3}
                    py={1}
                    fontSize="lg"
                    fontWeight="bold"
                  >
                    x{deckCard.quantity}
                  </Badge>
                  {/* Card Preview */}
                  <CardFormPreview
                    showWrapper={false}
                    formData={{
                      name: deckCard.card.name,
                      archetype: deckCard.card.archetype,
                      type: deckCard.card.type,
                      faction: deckCard.card.faction,
                      cost: deckCard.card.cost,
                      combat_power: deckCard.card.combat_power,
                      resilience: deckCard.card.resilience,
                      description: deckCard.card.description,
                      effects: deckCard.card.effects || [],
                      bonuses: deckCard.card.bonuses || [],
                      illustration: deckCard.card.illustration,
                      max_occurrence: deckCard.card.max_occurrence,
                    }}
                  />
                </Box>
              ))}
            </Flex>
          )}
        </Box>
      </VStack>
    </Box>
  )
}

export default DeckDetails
