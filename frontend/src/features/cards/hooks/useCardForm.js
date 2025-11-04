import { useState, useEffect } from 'react'
import axios from 'axios'
import { API_BASE_URL, ENDPOINTS, getApiUrl } from '@constants/api'

export const useCardForm = () => {
  // Preset data state
  const [archetypes, setArchetypes] = useState([])
  const [types, setTypes] = useState([])
  const [factions, setFactions] = useState([])
  const [effects, setEffects] = useState([])
  const [bonuses, setBonuses] = useState([])
  const [illustrations, setIllustrations] = useState([])
  
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // Fetch all preset data on mount
  useEffect(() => {
    fetchPresetData()
  }, [])

  const fetchPresetData = async () => {
    try {
      setLoading(true)
      const [
        archetypesRes,
        typesRes,
        factionsRes,
        effectsRes,
        bonusesRes,
        illustrationsRes,
      ] = await Promise.all([
        axios.get(getApiUrl('archetypes')),
        axios.get(getApiUrl('types')),
        axios.get(getApiUrl('factions')),
        axios.get(getApiUrl('effects')),
        axios.get(getApiUrl('bonuses')),
        axios.get(getApiUrl('illustrations')),
      ])

      setArchetypes(archetypesRes.data)
      setTypes(typesRes.data)
      setFactions(factionsRes.data)
      setEffects(effectsRes.data)
      setBonuses(bonusesRes.data)
      setIllustrations(illustrationsRes.data)
      setError(null)
    } catch (err) {
      console.error('Error fetching preset data:', err)
      setError('Failed to load form data')
    } finally {
      setLoading(false)
    }
  }

  // Create a new card
  const createCard = async (cardData) => {
    try {
      const response = await axios.post(getApiUrl('cards'), cardData)
      return response.data
    } catch (err) {
      console.error('Error creating card:', err)
      throw err
    }
  }

  return {
    archetypes,
    types,
    factions,
    effects,
    bonuses,
    illustrations,
    loading,
    error,
    createCard,
    refetchPresets: fetchPresetData,
  }
}
