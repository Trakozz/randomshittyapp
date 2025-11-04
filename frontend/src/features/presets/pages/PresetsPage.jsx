import { useState } from 'react'
import { Box, Heading } from '@chakra-ui/react'
import { Tabs } from '@chakra-ui/react'
import PresetTab from '../components/PresetTab'
import IllustrationsTab from '../components/IllustrationsTab'

/**
 * PresetsPage Component
 * 
 * Main page for managing all game presets including archetypes, types, factions,
 * effects, bonuses, and illustrations. Each preset type is displayed in its own tab
 * with full CRUD functionality.
 * 
 * Architecture Notes:
 * - Uses controlled tabs with state to force component remounting on tab switch
 * - Some presets require archetype binding (factions, effects, bonuses, illustrations)
 * - Effects have a complex form with multiple fields (name, description, archetype, effect_type)
 * - Archetype and Card Type presets are universal and don't require archetype binding
 */
const PresetsPage = () => {
  const [activeTab, setActiveTab] = useState('archetypes')

  /**
   * Renders the appropriate PresetTab component based on the active tab.
   * Each tab is configured with specific props:
   * - requiresArchetype: Entities that must be bound to an archetype
   * - isEffect: Special handling for Effect entities (complex form)
   * - fieldType: 'name', 'description', or 'complex' for form rendering
   */
  const renderTabContent = () => {
    switch (activeTab) {
      case 'archetypes':
        return <PresetTab entityType="Archetype" endpoint="archetypes" fieldType="name" />
      case 'types':
        return <PresetTab entityType="Type" endpoint="types" fieldType="name" />
      case 'effect_types':
        return <PresetTab entityType="EffectType" endpoint="effect_types" fieldType="name" />
      case 'factions':
        return <PresetTab entityType="Faction" endpoint="factions" fieldType="name" requiresArchetype={true} />
      case 'effects':
        return <PresetTab entityType="Effect" endpoint="effects" fieldType="complex" requiresArchetype={true} isEffect={true} />
      case 'bonuses':
        return <PresetTab entityType="Bonus" endpoint="bonuses" fieldType="description" requiresArchetype={true} />
      case 'illustrations':
        return <IllustrationsTab />
      default:
        return null
    }
  }

  return (
    <Box p={8}>
      <Heading as="h1" size="xl" mb={6}>
        Presets Management
      </Heading>

      <Tabs.Root value={activeTab} onValueChange={(e) => setActiveTab(e.value)}>
        <Tabs.List>
          <Tabs.Trigger value="archetypes">Archetypes</Tabs.Trigger>
          <Tabs.Trigger value="types">Types</Tabs.Trigger>
          <Tabs.Trigger value="effect_types">Effect Types</Tabs.Trigger>
          <Tabs.Trigger value="factions">Factions</Tabs.Trigger>
          <Tabs.Trigger value="effects">Effects</Tabs.Trigger>
          <Tabs.Trigger value="bonuses">Bonuses</Tabs.Trigger>
          <Tabs.Trigger value="illustrations">Illustrations</Tabs.Trigger>
        </Tabs.List>

        <Box mt={6}>
          {renderTabContent()}
        </Box>
      </Tabs.Root>
    </Box>
  )
}

export default PresetsPage
