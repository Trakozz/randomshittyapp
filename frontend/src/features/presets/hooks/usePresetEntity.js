import { useState, useEffect } from 'react'
import axios from 'axios'
import { API_BASE_URL, ENDPOINTS, getApiUrl } from '@constants/api'

/**
 * usePresetEntity Hook
 * 
 * Custom hook that encapsulates all business logic for managing preset entities.
 * Handles CRUD operations, modal/dialog state, and fetching related data (archetypes, effect types).
 * 
 * Features:
 * - Full CRUD operations (Create, Read, Update, Delete)
 * - Modal state management for create/edit forms
 * - Delete confirmation dialog state
 * - Automatic fetching of archetypes when required
 * - Automatic fetching of effect types for Effect entities
 * 
 * @param {string} entityType - Display name of the entity
 * @param {string} endpoint - API endpoint for CRUD operations
 * @param {string} fieldType - Type of form field
 * @param {boolean} requiresArchetype - Whether entity requires archetype binding
 * @param {boolean} isEffect - Whether this is an Effect entity
 * @returns {Object} State and handler functions for preset entity management
 */
export const usePresetEntity = (entityType, endpoint, fieldType, requiresArchetype = false, isEffect = false) => {
  // Entity data state
  const [data, setData] = useState([])
  const [formData, setFormData] = useState({})
  const [editingId, setEditingId] = useState(null)
  
  // UI state
  const [modalOpen, setModalOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [itemToDelete, setItemToDelete] = useState(null)
  
  // Related data for form dropdowns
  const [archetypes, setArchetypes] = useState([])
  const [effectTypes, setEffectTypes] = useState([])

  // Fetch archetypes when component mounts if entity requires archetype binding
  useEffect(() => {
    if (requiresArchetype || isEffect) {
      fetchArchetypes()
    }
  }, [requiresArchetype, isEffect])

  // Fetch effect types when component mounts if entity is an Effect
  useEffect(() => {
    if (isEffect) {
      fetchEffectTypes()
    }
  }, [isEffect])

  /**
   * Fetches all archetypes from the API for dropdown selection
   */
  const fetchArchetypes = async () => {
    try {
      const response = await axios.get(getApiUrl('archetypes'))
      setArchetypes(response.data)
    } catch (error) {
      console.error('Error fetching archetypes:', error)
    }
  }

  /**
   * Fetches all effect types from the API for Effect form dropdown
   */
  const fetchEffectTypes = async () => {
    try {
      const response = await axios.get(getApiUrl('effectTypes'))
      setEffectTypes(response.data)
    } catch (error) {
      console.error('Error fetching effect types:', error)
    }
  }

  /**
   * Fetches all entities of this type from the API
   */
  const fetchData = async () => {
    try {
      const response = await axios.get(getApiUrl(endpoint))
      setData(response.data)
    } catch (error) {
      console.error(`Error fetching ${entityType}:`, error)
    }
  }

  /**
   * Opens the create modal with empty form data
   */
  const handleCreate = () => {
    setEditingId(null)
    setFormData({})
    setModalOpen(true)
  }

  /**
   * Opens the edit modal with the selected item's data
   * @param {Object} item - The entity to edit
   */
  const handleEdit = (item) => {
    setEditingId(item.id)
    setFormData(item)
    setModalOpen(true)
  }

  /**
   * Saves the entity (create or update) via API
   * Refreshes the data list on success
   */
  const handleSave = async () => {
    try {
      if (editingId) {
        // Update existing entity
        await axios.put(`${getApiUrl(endpoint)}/${editingId}`, formData)
      } else {
        // Create new entity
        await axios.post(getApiUrl(endpoint), formData)
      }
      setModalOpen(false)
      setFormData({})
      setEditingId(null)
      fetchData() // Refresh the list
    } catch (error) {
      console.error(`Error saving ${entityType}:`, error)
      alert(`Error saving ${entityType}: ${error.response?.data?.detail || error.message}`)
    }
  }

  /**
   * Opens the delete confirmation dialog
   * @param {Object} item - The entity to delete
   */
  const handleDeleteClick = (item) => {
    setItemToDelete(item)
    setDeleteDialogOpen(true)
  }

  /**
   * Confirms and executes entity deletion via API
   * Refreshes the data list on success
   */
  const handleDeleteConfirm = async () => {
    try {
      await axios.delete(`${getApiUrl(endpoint)}/${itemToDelete.id}`)
      setDeleteDialogOpen(false)
      setItemToDelete(null)
      fetchData() // Refresh the list
    } catch (error) {
      console.error(`Error deleting ${entityType}:`, error)
      alert(`Error deleting ${entityType}: ${error.response?.data?.detail || error.message}`)
    }
  }

  /**
   * Closes the create/edit modal and resets form state
   */
  const closeModal = () => {
    setModalOpen(false)
    setFormData({})
    setEditingId(null)
  }

  /**
   * Closes the delete confirmation dialog
   */
  const closeDeleteDialog = () => {
    setDeleteDialogOpen(false)
    setItemToDelete(null)
  }

  return {
    data,
    formData,
    setFormData,
    editingId,
    modalOpen,
    deleteDialogOpen,
    archetypes,
    effectTypes,
    fetchData,
    handleCreate,
    handleEdit,
    handleSave,
    handleDeleteClick,
    handleDeleteConfirm,
    closeModal,
    closeDeleteDialog,
  }
}
