import { useMemo, useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate, useParams } from 'react-router-dom'
import {
  Box,
  Button,
  VStack,
  HStack,
  Heading,
  Grid,
  Text,
  Spinner,
} from '@chakra-ui/react'
import { toaster } from '@/components/ui/toaster'
import { useCardForm } from '../hooks/useCardForm'
import { CardFormPreview } from '../components/CardFormPreview'
import { CardBasicInfoFieldsWithUpload } from '../components/form/CardBasicInfoFieldsWithUpload'
import { CardStatsFields } from '../components/form/CardStatsFields'
import { CardDescriptionField } from '../components/form/CardDescriptionField'
import { CardEffectsFields } from '../components/form/CardEffectsFields'
import { CardBonusesFields } from '../components/form/CardBonusesFields'

/**
 * CardCreatePage Component
 * 
 * Full-featured card creation/edit form with:
 * - React Hook Form for form state management and validation
 * - Real-time preview that updates as user types (using watch())
 * - All preset data loaded from API
 * - Multi-select for effects and bonuses
 * - Comprehensive validation
 * - Success/error notifications
 * - Support for both create and edit modes
 */
const CardCreatePage = () => {
  const navigate = useNavigate()
  const { cardId } = useParams()
  const isEditMode = Boolean(cardId)
  
  const {
    archetypes,
    types,
    factions,
    effects,
    bonuses,
    illustrations,
    loading: presetsLoading,
    error: presetsError,
    createCard,
    updateCard,
    fetchCard,
  } = useCardForm()

  const [submitting, setSubmitting] = useState(false)
  const [loadingCard, setLoadingCard] = useState(isEditMode)

  // React Hook Form setup with default values and validation rules
  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: '',
      archetype_id: '',
      type_id: '',
      faction_id: '',
      cost: 0,
      combat_power: 0,
      resilience: 0,
      description: '',
      effect_ids: [],
      bonus_ids: [],
      illustration_id: '',
      max_occurrence: 1,
    },
  })

  // Load card data when in edit mode
  useEffect(() => {
    if (isEditMode && cardId) {
      loadCardData(cardId)
    }
  }, [cardId, isEditMode])

  const loadCardData = async (id) => {
    try {
      setLoadingCard(true)
      const card = await fetchCard(id)
      
      // Populate form with card data
      reset({
        name: card.name,
        archetype_id: card.archetype_id.toString(),
        type_id: card.type_id.toString(),
        faction_id: card.faction_id.toString(),
        cost: card.cost,
        combat_power: card.combat_power,
        resilience: card.resilience,
        description: card.description || '',
        effect_ids: card.effects?.map(e => e.id) || [],
        bonus_ids: card.bonuses?.map(b => b.id) || [],
        illustration_id: card.illustration_id ? card.illustration_id.toString() : '',
        max_occurrence: card.max_occurrence,
      })
    } catch (error) {
      console.error('Error loading card:', error)
      toaster.create({
        title: 'Failed to load card',
        description: 'Could not load card data for editing.',
        type: 'error',
        duration: 5000,
      })
      navigate('/cards')
    } finally {
      setLoadingCard(false)
    }
  }

  /**
   * Watch all form values for real-time preview updates
   * This creates a live connection between form inputs and the preview component
   */
  const watchedValues = watch()

  // Transform watched values to include full objects for preview
  // Using useMemo to avoid infinite loop from object reference changes
  const previewData = useMemo(() => {
    // Find full objects from IDs for richer preview display
    const archetype = archetypes.find((a) => a.id === Number(watchedValues.archetype_id))
    const type = types.find((t) => t.id === Number(watchedValues.type_id))
    const faction = factions.find((f) => f.id === Number(watchedValues.faction_id))
    const illustration = illustrations.find((i) => i.id === Number(watchedValues.illustration_id))
    
    console.log('Preview - illustration_id:', watchedValues.illustration_id)
    console.log('Preview - found illustration:', illustration)
    console.log('Preview - available illustrations:', illustrations)
    
    const selectedEffects = effects.filter((e) =>
      watchedValues.effect_ids?.includes(e.id)
    )
    const selectedBonuses = bonuses.filter((b) =>
      watchedValues.bonus_ids?.includes(b.id)
    )

    return {
      ...watchedValues,
      archetype,
      type,
      faction,
      illustration,
      effects: selectedEffects,
      bonuses: selectedBonuses,
    }
  }, [
    watchedValues.name,
    watchedValues.archetype_id,
    watchedValues.type_id,
    watchedValues.faction_id,
    watchedValues.illustration_id,
    watchedValues.cost,
    watchedValues.combat_power,
    watchedValues.resilience,
    watchedValues.max_occurrence,
    watchedValues.effect_ids,
    watchedValues.bonus_ids,
    archetypes,
    types,
    factions,
    effects,
    bonuses,
    illustrations,
  ])

  /**
   * Form submission handler
   * Validates, sends to API, and shows success/error notifications
   */
  const onSubmit = async (data) => {
    try {
      setSubmitting(true)

      // Transform form data to match API expectations
      const cardData = {
        name: data.name,
        archetype_id: Number(data.archetype_id),
        type_id: Number(data.type_id),
        faction_id: Number(data.faction_id),
        cost: Number(data.cost),
        combat_power: Number(data.combat_power),
        resilience: Number(data.resilience),
        illustration_id: data.illustration_id && data.illustration_id !== '' ? Number(data.illustration_id) : null,
        description: data.description && data.description.trim() !== '' ? data.description : null,
        max_occurrence: Number(data.max_occurrence),
        effect_ids: data.effect_ids || [],
        bonus_ids: data.bonus_ids || [],
      }

      if (isEditMode) {
        // Update existing card
        const updatedCard = await updateCard(cardId, cardData)
        
        toaster.create({
          title: 'Card updated successfully',
          description: `"${updatedCard.name}" has been updated.`,
          type: 'success',
          duration: 5000,
        })
      } else {
        // Create new card
        const createdCard = await createCard(cardData)
        
        toaster.create({
          title: 'Card created successfully',
          description: `"${createdCard.name}" has been added to your collection.`,
          type: 'success',
          duration: 5000,
        })
        
        reset()
      }

      // Navigate back to cards list
      setTimeout(() => navigate('/cards'), 1500)
    } catch (error) {
      console.error(`Error ${isEditMode ? 'updating' : 'creating'} card:`, error)
      
      // Extract error message from validation errors or general error
      let errorMessage = `An error occurred while ${isEditMode ? 'updating' : 'creating'} the card.`
      
      if (error.response?.data?.detail) {
        // Handle array of validation errors
        if (Array.isArray(error.response.data.detail)) {
          errorMessage = error.response.data.detail
            .map(err => `${err.loc?.join(' > ') || 'Field'}: ${err.msg}`)
            .join(', ')
        } else if (typeof error.response.data.detail === 'string') {
          errorMessage = error.response.data.detail
        } else {
          errorMessage = JSON.stringify(error.response.data.detail)
        }
      }
      
      toaster.create({
        title: `Failed to ${isEditMode ? 'update' : 'create'} card`,
        description: errorMessage,
        type: 'error',
        duration: 7000,
      })
    } finally {
      setSubmitting(false)
    }
  }

  /**
   * Reset handler - clears form and preview
   */
  const handleReset = () => {
    reset()
    toaster.create({
      title: 'Form reset',
      description: 'All fields have been cleared.',
      type: 'info',
      duration: 3000,
    })
  }

  /**
   * Cancel handler - navigate back without saving
   */
  const handleCancel = () => {
    navigate('/cards')
  }

  // Loading state while fetching presets or card data
  if (presetsLoading || loadingCard) {
    return (
      <Box p={8}>
        <VStack gap={4}>
          <Spinner size="xl" />
          <Text>{loadingCard ? 'Loading card data...' : 'Loading form data...'}</Text>
        </VStack>
      </Box>
    )
  }

  // Error state if presets failed to load
  if (presetsError) {
    return (
      <Box p={8}>
        <VStack gap={4}>
          <Text color="red.500" fontSize="lg">
            {presetsError}
          </Text>
          <Button onClick={() => window.location.reload()}>Retry</Button>
        </VStack>
      </Box>
    )
  }

  return (
    <Box p={8}>
      <VStack align="stretch" gap={6}>
        {/* Page Header */}
        <HStack justify="space-between">
          <Heading as="h1" size="xl">
            {isEditMode ? 'Edit Card' : 'Create New Card'}
          </Heading>
          <HStack gap={2}>
            <Button variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
            {!isEditMode && (
              <Button variant="outline" onClick={handleReset}>
                Reset Form
              </Button>
            )}
          </HStack>
        </HStack>

        {/* Main Form Layout - Two Column Grid (Form + Preview) */}
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid templateColumns={{ base: '1fr', lg: '1fr 400px' }} gap={8}>
            {/* Left Column: Form Fields */}
            <VStack align="stretch" gap={6}>
              {/* Basic Information Section */}
              <CardBasicInfoFieldsWithUpload
                register={register}
                errors={errors}
                setValue={setValue}
                archetypes={archetypes}
                types={types}
                factions={factions}
                illustrations={illustrations}
              />

              {/* Stats Section */}
              <CardStatsFields
                control={control}
                errors={errors}
              />

              {/* Description Section */}
              <CardDescriptionField
                register={register}
                errors={errors}
              />

              {/* Effects Section */}
              <CardEffectsFields
                control={control}
                effects={effects}
              />

              {/* Bonuses Section */}
              <CardBonusesFields
                control={control}
                bonuses={bonuses}
              />

              {/* Submit Buttons */}
              <HStack justify="flex-end" pt={4} borderTopWidth="1px">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCancel}
                  disabled={submitting}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  colorPalette="blue"
                  loading={submitting}
                  disabled={submitting}
                >
                  {isEditMode ? 'Update Card' : 'Create Card'}
                </Button>
              </HStack>
            </VStack>

            {/* Right Column: Live Preview */}
            <Box>
              <CardFormPreview formData={previewData} />
            </Box>
          </Grid>
        </form>
      </VStack>
    </Box>
  )
}

export default CardCreatePage
