from typing import Optional
from server.repositories.card_repository import CardRepository


class CardService:
    def __init__(self, repo: CardRepository):
        self.repo = repo

    def create_card(
        self,
        name: str,
        archetype_id: int,
        type_id: int,
        faction_id: int,
        cost: int,
        combat_power: int,
        resilience: int,
        max_occurrence: int,
        illustration_id: Optional[int] = None,
        description: Optional[str] = None
    ):
        """Create a new card with validation."""
        # Basic validation
        if cost < 0:
            raise ValueError("Cost cannot be negative")
        if combat_power < 0:
            raise ValueError("Combat power cannot be negative")
        if resilience < 0:
            raise ValueError("Resilience cannot be negative")
        if max_occurrence < 1:
            raise ValueError("Max occurrence must be at least 1")
        
        return self.repo.create(
            name=name,
            archetype_id=archetype_id,
            type_id=type_id,
            faction_id=faction_id,
            cost=cost,
            combat_power=combat_power,
            resilience=resilience,
            max_occurrence=max_occurrence,
            illustration_id=illustration_id,
            description=description
        )

    def get_card(self, card_id: int, load_relationships: bool = False):
        """Get a card by ID, optionally loading effects and bonuses."""
        return self.repo.get(card_id, load_relationships=load_relationships)

    def list_cards(self, load_relationships: bool = False):
        """List all cards, optionally loading effects and bonuses."""
        return self.repo.list(load_relationships=load_relationships)
    
    def update_card(
        self,
        card_id: int,
        name: Optional[str] = None,
        archetype_id: Optional[int] = None,
        type_id: Optional[int] = None,
        faction_id: Optional[int] = None,
        cost: Optional[int] = None,
        combat_power: Optional[int] = None,
        resilience: Optional[int] = None,
        max_occurrence: Optional[int] = None,
        illustration_id: Optional[int] = None,
        description: Optional[str] = None
    ):
        """Update a card with validation."""
        # Validate updated values
        if cost is not None and cost < 0:
            raise ValueError("Cost cannot be negative")
        if combat_power is not None and combat_power < 0:
            raise ValueError("Combat power cannot be negative")
        if resilience is not None and resilience < 0:
            raise ValueError("Resilience cannot be negative")
        if max_occurrence is not None and max_occurrence < 1:
            raise ValueError("Max occurrence must be at least 1")
        
        return self.repo.update(
            card_id=card_id,
            name=name,
            archetype_id=archetype_id,
            type_id=type_id,
            faction_id=faction_id,
            cost=cost,
            combat_power=combat_power,
            resilience=resilience,
            max_occurrence=max_occurrence,
            illustration_id=illustration_id,
            description=description
        )
    
    def delete_card(self, card_id: int):
        """Delete a card by ID."""
        return self.repo.delete(card_id)
    
    def add_effect_to_card(self, card_id: int, effect_id: int):
        """Add an effect to a card."""
        return self.repo.add_effect(card_id, effect_id)
    
    def remove_effect_from_card(self, card_id: int, effect_id: int):
        """Remove an effect from a card."""
        return self.repo.remove_effect(card_id, effect_id)
    
    def add_bonus_to_card(self, card_id: int, bonus_id: int):
        """Add a bonus to a card."""
        return self.repo.add_bonus(card_id, bonus_id)
    
    def remove_bonus_from_card(self, card_id: int, bonus_id: int):
        """Remove a bonus from a card."""
        return self.repo.remove_bonus(card_id, bonus_id)
    
    def get_card_effects(self, card_id: int):
        """Get all effects for a card."""
        return self.repo.get_card_effects(card_id)
    
    def get_card_bonuses(self, card_id: int):
        """Get all bonuses for a card."""
        return self.repo.get_card_bonuses(card_id)
    
