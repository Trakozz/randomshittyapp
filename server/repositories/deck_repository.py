from typing import List, Optional, Dict
from sqlalchemy import select
from sqlalchemy.orm import selectinload
from server.db.schema.deck import Deck
from server.db.schema.card import Card
from server.db.schema.deck_card import DeckCard
from server.db.db_config import SessionLocal


class DeckRepository:
    
    def create(self, name: str, archetype_id: int, description: Optional[str] = None) -> Deck:
        """Create a new deck."""
        with SessionLocal() as session:
            deck = Deck(name=name, description=description, archetype_id=archetype_id)
            session.add(deck)
            session.commit()
            session.refresh(deck)
            return deck
    
    def get(self, deck_id: int, load_cards: bool = False) -> Optional[Deck]:
        """Retrieve a deck by its ID, optionally loading cards."""
        with SessionLocal() as session:
            if load_cards:
                stmt = select(Deck).where(Deck.id == deck_id).options(
                    selectinload(Deck.cards)
                )
                result = session.execute(stmt).scalar_one_or_none()
                if result:
                    session.expunge(result)
                return result
            return session.get(Deck, deck_id)
         
    def list(self, load_cards: bool = False) -> List[Deck]:
        """Return all decks in the database, optionally loading cards."""
        with SessionLocal() as session:
            if load_cards:
                stmt = select(Deck).options(selectinload(Deck.cards))
                result = session.execute(stmt).scalars().all()
                for deck in result:
                    session.expunge(deck)
                return result
            result = session.scalars(select(Deck)).all()
            return result
        
    def get_by_name(self, name: str) -> Optional[Deck]:
        """Return a deck by its name."""
        with SessionLocal() as session:
            stmt = select(Deck).where(Deck.name == name)
            return session.scalars(stmt).first()
        
    def update(
        self,
        deck_id: int,
        name: Optional[str] = None,
        description: Optional[str] = None,
        archetype_id: Optional[int] = None
    ) -> Optional[Deck]:
        """Update a deck's attributes."""
        with SessionLocal() as session:
            deck = session.get(Deck, deck_id)
            if not deck:
                return None
            if name is not None:
                deck.name = name
            if description is not None:
                deck.description = description
            if archetype_id is not None:
                deck.archetype_id = archetype_id
            session.commit()
            session.refresh(deck)
            return deck
        
    def delete(self, deck_id: int) -> bool:
        """Delete a deck by its ID."""
        with SessionLocal() as session:
            deck = session.get(Deck, deck_id)
            if not deck:
                return False
            session.delete(deck)
            session.commit()
            return True

    def add_card(self, deck_id: int, card_id: int, quantity: int) -> bool:
        """Add a card to a deck with specified quantity."""
        with SessionLocal() as session:
            # Check if deck and card exist
            deck = session.get(Deck, deck_id)
            card = session.get(Card, card_id)
            if not deck or not card:
                return False
            
            # Check if association already exists
            existing = session.get(DeckCard, {"deck_id": deck_id, "card_id": card_id})
            if existing:
                # Update quantity
                existing.quantity = quantity
            else:
                # Create new association
                deck_card = DeckCard(deck_id=deck_id, card_id=card_id, quantity=quantity)
                session.add(deck_card)
            
            session.commit()
            return True

    def remove_card(self, deck_id: int, card_id: int) -> bool:
        """Remove a card from a deck."""
        with SessionLocal() as session:
            deck_card = session.get(DeckCard, {"deck_id": deck_id, "card_id": card_id})
            if not deck_card:
                return False
            session.delete(deck_card)
            session.commit()
            return True

    def update_card_quantity(self, deck_id: int, card_id: int, quantity: int) -> bool:
        """Update the quantity of a card in a deck."""
        with SessionLocal() as session:
            deck_card = session.get(DeckCard, {"deck_id": deck_id, "card_id": card_id})
            if not deck_card:
                return False
            deck_card.quantity = quantity
            session.commit()
            return True

    def get_deck_cards(self, deck_id: int) -> List[Dict]:
        """Get all cards in a deck with their quantities."""
        with SessionLocal() as session:
            deck = session.get(Deck, deck_id)
            if not deck:
                return []
            
            # Query DeckCard associations with Card data
            stmt = (
                select(DeckCard, Card)
                .join(Card, DeckCard.card_id == Card.id)
                .where(DeckCard.deck_id == deck_id)
            )
            results = session.execute(stmt).all()
            
            # Build response with card data and quantity
            cards_data = []
            for deck_card, card in results:
                session.expunge(card)
                cards_data.append({
                    "card": card,
                    "quantity": deck_card.quantity
                })
            
            return cards_data

    def get_card_quantity(self, deck_id: int, card_id: int) -> Optional[int]:
        """Get the quantity of a specific card in a deck."""
        with SessionLocal() as session:
            deck_card = session.get(DeckCard, {"deck_id": deck_id, "card_id": card_id})
            return deck_card.quantity if deck_card else None

    def get_total_cards(self, deck_id: int) -> int:
        """Get the total number of cards in a deck (sum of all quantities)."""
        with SessionLocal() as session:
            stmt = select(DeckCard).where(DeckCard.deck_id == deck_id)
            deck_cards = session.scalars(stmt).all()
            return sum(dc.quantity for dc in deck_cards)

