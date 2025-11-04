from typing import List, Optional
from sqlalchemy import select
from sqlalchemy.orm import selectinload
from server.db.schema.card import Card
from server.db.schema.effect import Effect
from server.db.schema.bonus import Bonus
from server.db.schema.card_effect import CardEffect
from server.db.schema.card_bonus import CardBonus
from server.db.db_config import SessionLocal


class CardRepository:
    def create(
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
    ) -> Card:
        """Create a new card with all required attributes."""
        with SessionLocal() as session:
            card = Card(
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
            session.add(card)
            session.commit()
            session.refresh(card)
            return card

    def get(self, card_id: int, load_relationships: bool = False) -> Optional[Card]:
        """Retrieve a card by its ID, optionally loading effects and bonuses."""
        with SessionLocal() as session:
            if load_relationships:
                stmt = select(Card).where(Card.id == card_id).options(
                    selectinload(Card.effects),
                    selectinload(Card.bonuses)
                )
                result = session.execute(stmt).scalar_one_or_none()
                if result:
                    # Make a copy to detach from session
                    session.expunge(result)
                return result
            return session.get(Card, card_id)

    def list(self, load_relationships: bool = False) -> List[Card]:
        """Return all cards in the database, optionally loading effects and bonuses."""
        with SessionLocal() as session:
            if load_relationships:
                stmt = select(Card).options(
                    selectinload(Card.effects),
                    selectinload(Card.bonuses)
                )
                result = session.execute(stmt).scalars().all()
                # Detach from session
                for card in result:
                    session.expunge(card)
                return result
            result = session.scalars(select(Card)).all()
            return result

    def update(
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
    ) -> Optional[Card]:
        """Update a card's attributes."""
        with SessionLocal() as session:
            card = session.get(Card, card_id)
            if not card:
                return None
            
            if name is not None:
                card.name = name
            if archetype_id is not None:
                card.archetype_id = archetype_id
            if type_id is not None:
                card.type_id = type_id
            if faction_id is not None:
                card.faction_id = faction_id
            if cost is not None:
                card.cost = cost
            if combat_power is not None:
                card.combat_power = combat_power
            if resilience is not None:
                card.resilience = resilience
            if max_occurrence is not None:
                card.max_occurrence = max_occurrence
            if illustration_id is not None:
                card.illustration_id = illustration_id
            if description is not None:
                card.description = description
            
            session.commit()
            session.refresh(card)
            return card

    def delete(self, card_id: int) -> bool:
        """Delete a card by its ID."""
        with SessionLocal() as session:
            card = session.get(Card, card_id)
            if not card:
                return False
            session.delete(card)
            session.commit()
            return True

    def add_effect(self, card_id: int, effect_id: int) -> bool:
        """Add an effect to a card via CardEffect association."""
        with SessionLocal() as session:
            # Check if card and effect exist
            card = session.get(Card, card_id)
            effect = session.get(Effect, effect_id)
            if not card or not effect:
                return False
            
            # Check if association already exists
            existing = session.get(CardEffect, {"card_id": card_id, "effect_id": effect_id})
            if existing:
                return True  # Already exists, consider it success
            
            # Create association
            card_effect = CardEffect(card_id=card_id, effect_id=effect_id)
            session.add(card_effect)
            session.commit()
            return True

    def remove_effect(self, card_id: int, effect_id: int) -> bool:
        """Remove an effect from a card."""
        with SessionLocal() as session:
            card_effect = session.get(CardEffect, {"card_id": card_id, "effect_id": effect_id})
            if not card_effect:
                return False
            session.delete(card_effect)
            session.commit()
            return True

    def add_bonus(self, card_id: int, bonus_id: int) -> bool:
        """Add a bonus to a card via CardBonus association."""
        with SessionLocal() as session:
            # Check if card and bonus exist
            card = session.get(Card, card_id)
            bonus = session.get(Bonus, bonus_id)
            if not card or not bonus:
                return False
            
            # Check if association already exists
            existing = session.get(CardBonus, {"card_id": card_id, "bonus_id": bonus_id})
            if existing:
                return True  # Already exists, consider it success
            
            # Create association
            card_bonus = CardBonus(card_id=card_id, bonus_id=bonus_id)
            session.add(card_bonus)
            session.commit()
            return True

    def remove_bonus(self, card_id: int, bonus_id: int) -> bool:
        """Remove a bonus from a card."""
        with SessionLocal() as session:
            card_bonus = session.get(CardBonus, {"card_id": card_id, "bonus_id": bonus_id})
            if not card_bonus:
                return False
            session.delete(card_bonus)
            session.commit()
            return True

    def get_card_effects(self, card_id: int) -> List[Effect]:
        """Get all effects for a card."""
        with SessionLocal() as session:
            card = session.get(Card, card_id)
            if not card:
                return []
            stmt = select(Card).where(Card.id == card_id).options(selectinload(Card.effects))
            card = session.execute(stmt).scalar_one_or_none()
            if card:
                effects = list(card.effects)
                for effect in effects:
                    session.expunge(effect)
                return effects
            return []

    def get_card_bonuses(self, card_id: int) -> List[Bonus]:
        """Get all bonuses for a card."""
        with SessionLocal() as session:
            card = session.get(Card, card_id)
            if not card:
                return []
            stmt = select(Card).where(Card.id == card_id).options(selectinload(Card.bonuses))
            card = session.execute(stmt).scalar_one_or_none()
            if card:
                bonuses = list(card.bonuses)
                for bonus in bonuses:
                    session.expunge(bonus)
                return bonuses
            return []