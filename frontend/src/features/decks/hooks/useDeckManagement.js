import { useState } from 'react'
import axios from 'axios'
import { API_BASE_URL, ENDPOINTS, getApiUrl } from '@constants/api'

export const useDeckManagement = () => {
  const [decks, setDecks] = useState([])
  const [selectedDeck, setSelectedDeck] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // Fetch all decks
  const fetchDecks = async () => {
    try {
      setLoading(true)
      const response = await axios.get(getApiUrl('decks'))
      setDecks(response.data)
      setError(null)
    } catch (err) {
      console.error('Error fetching decks:', err)
      setError(err.response?.data?.detail || 'Failed to fetch decks')
    } finally {
      setLoading(false)
    }
  }

  // Fetch single deck
  const fetchDeck = async (deckId) => {
    try {
      setLoading(true)
      const response = await axios.get(`${getApiUrl('decks')}/${deckId}`)
      setSelectedDeck(response.data)
      setError(null)
      return response.data
    } catch (err) {
      console.error('Error fetching deck:', err)
      setError(err.response?.data?.detail || 'Failed to fetch deck')
      return null
    } finally {
      setLoading(false)
    }
  }

  // Create deck
  const createDeck = async (deckData) => {
    try {
      setLoading(true)
      const response = await axios.post(getApiUrl('decks'), deckData)
      await fetchDecks() // Refresh list
      setError(null)
      return response.data
    } catch (err) {
      console.error('Error creating deck:', err)
      setError(err.response?.data?.detail || 'Failed to create deck')
      throw err
    } finally {
      setLoading(false)
    }
  }

  // Update deck
  const updateDeck = async (deckId, deckData) => {
    try {
      setLoading(true)
      const response = await axios.put(`${getApiUrl('decks')}/${deckId}`, deckData)
      await fetchDecks() // Refresh list
      if (selectedDeck?.id === deckId) {
        setSelectedDeck(response.data)
      }
      setError(null)
      return response.data
    } catch (err) {
      console.error('Error updating deck:', err)
      setError(err.response?.data?.detail || 'Failed to update deck')
      throw err
    } finally {
      setLoading(false)
    }
  }

  // Delete deck
  const deleteDeck = async (deckId) => {
    try {
      setLoading(true)
      await axios.delete(`${getApiUrl('decks')}/${deckId}`)
      await fetchDecks() // Refresh list
      if (selectedDeck?.id === deckId) {
        setSelectedDeck(null)
      }
      setError(null)
    } catch (err) {
      console.error('Error deleting deck:', err)
      setError(err.response?.data?.detail || 'Failed to delete deck')
      throw err
    } finally {
      setLoading(false)
    }
  }

  // Fetch cards in deck
  const fetchDeckCards = async (deckId) => {
    try {
      const response = await axios.get(`${getApiUrl('decks')}/${deckId}/cards`)
      return response.data
    } catch (err) {
      console.error('Error fetching deck cards:', err)
      setError(err.response?.data?.detail || 'Failed to fetch deck cards')
      return []
    }
  }

  // Add card to deck
  const addCardToDeck = async (deckId, cardId, quantity = 1) => {
    try {
      await axios.post(`${getApiUrl('decks')}/${deckId}/cards`, { card_id: cardId, quantity })
      setError(null)
    } catch (err) {
      console.error('Error adding card to deck:', err)
      setError(err.response?.data?.detail || 'Failed to add card to deck')
      throw err
    }
  }

  // Remove card from deck
  const removeCardFromDeck = async (deckId, cardId) => {
    try {
      await axios.delete(`${getApiUrl('decks')}/${deckId}/cards/${cardId}`)
      setError(null)
    } catch (err) {
      console.error('Error removing card from deck:', err)
      setError(err.response?.data?.detail || 'Failed to remove card from deck')
      throw err
    }
  }

  // Update card quantity
  const updateCardQuantity = async (deckId, cardId, quantity) => {
    try {
      await axios.put(`${getApiUrl('decks')}/${deckId}/cards/${cardId}`, { quantity })
      setError(null)
    } catch (err) {
      console.error('Error updating card quantity:', err)
      setError(err.response?.data?.detail || 'Failed to update card quantity')
      throw err
    }
  }

  // Get total cards in deck
  const getTotalCards = async (deckId) => {
    try {
      const response = await axios.get(`${getApiUrl('decks')}/${deckId}/total`)
      return response.data.total
    } catch (err) {
      console.error('Error getting total cards:', err)
      return 0
    }
  }

  // Validate deck
  const validateDeck = async (deckId) => {
    try {
      const response = await axios.get(`${getApiUrl('decks')}/${deckId}/validate`)
      return response.data
    } catch (err) {
      console.error('Error validating deck:', err)
      return null
    }
  }

  return {
    decks,
    selectedDeck,
    loading,
    error,
    setSelectedDeck,
    fetchDecks,
    fetchDeck,
    createDeck,
    updateDeck,
    deleteDeck,
    fetchDeckCards,
    addCardToDeck,
    removeCardFromDeck,
    updateCardQuantity,
    getTotalCards,
    validateDeck,
  }
}
