/**
 * API Configuration Constants
 */

export const API_BASE_URL = 'http://localhost:8000/api/v1'

/**
 * API Endpoints
 */
export const ENDPOINTS = {
  // Presets
  ARCHETYPES: '/archetypes',
  TYPES: '/types',
  EFFECT_TYPES: '/effect_types',
  FACTIONS: '/factions',
  EFFECTS: '/effects',
  BONUSES: '/bonuses',
  ILLUSTRATIONS: '/illustrations',
  ILLUSTRATIONS_UPLOAD: '/illustrations/upload',
  
  // Cards
  CARDS: '/cards',
  
  // Decks
  DECKS: '/decks',
}

/**
 * Build full API URL
 * @param {string} endpoint - The endpoint path (with or without leading slash) or endpoint key
 * @returns {string} Full API URL
 * 
 * @example
 * getApiUrl('archetypes')         // 'http://localhost:8000/api/v1/archetypes'
 * getApiUrl('/archetypes')        // 'http://localhost:8000/api/v1/archetypes'
 * getApiUrl('ARCHETYPES')         // 'http://localhost:8000/api/v1/archetypes'
 */
export const getApiUrl = (endpoint) => {
  // Add leading slash if not present
  const path = endpoint.startsWith('/') ? endpoint : `/${endpoint}`
  return `${API_BASE_URL}${path}`
}
