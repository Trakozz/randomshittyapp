from typing import Optional
from server.repositories.deck_repository import DeckRepository
from server.repositories.card_repository import CardRepository


class DeckService:
    def __init__(self, deck_repo: DeckRepository, card_repo: Optional[CardRepository] = None):
        self.deck_repo = deck_repo
        self.card_repo = card_repo or CardRepository()

    def create_deck(self, name: str, archetype_id: int, description: Optional[str] = None):
        """Create a new deck."""
        return self.deck_repo.create(name=name, archetype_id=archetype_id, description=description)

    def get_deck(self, deck_id: int, load_cards: bool = False):
        """Get a deck by ID, optionally loading cards."""
        return self.deck_repo.get(deck_id, load_cards=load_cards)

    def list_decks(self, load_cards: bool = False):
        """List all decks, optionally loading cards."""
        return self.deck_repo.list(load_cards=load_cards)
    
    def update_deck(
        self,
        deck_id: int,
        name: Optional[str] = None,
        description: Optional[str] = None,
        archetype_id: Optional[int] = None
    ):
        """Update a deck's attributes."""
        return self.deck_repo.update(deck_id=deck_id, name=name, description=description, archetype_id=archetype_id)
    
    def delete_deck(self, deck_id: int):
        """Delete a deck by ID."""
        return self.deck_repo.delete(deck_id)
    
    def get_deck_by_name(self, name: str):
        """Get a deck by name."""
        return self.deck_repo.get_by_name(name)
    
    def add_card_to_deck(self, deck_id: int, card_id: int, quantity: int):
        """
        Add a card to a deck with validation.
        Enforces the max_occurrence constraint from the Card model.
        """
        # Validate quantity is positive
        if quantity < 1:
            raise ValueError("Quantity must be at least 1")
        
        # Get the card to check max_occurrence
        card = self.card_repo.get(card_id)
        if not card:
            raise ValueError(f"Card with ID {card_id} not found")
        
        # Validate quantity doesn't exceed max_occurrence
        if quantity > card.max_occurrence:
            raise ValueError(
                f"Quantity ({quantity}) exceeds max_occurrence ({card.max_occurrence}) for card '{card.name}'"
            )
        
        # Add card to deck
        success = self.deck_repo.add_card(deck_id, card_id, quantity)
        if not success:
            raise ValueError(f"Failed to add card to deck. Deck ID {deck_id} may not exist.")
        
        return True
    
    def remove_card_from_deck(self, deck_id: int, card_id: int):
        """Remove a card from a deck."""
        success = self.deck_repo.remove_card(deck_id, card_id)
        if not success:
            raise ValueError("Card not found in deck")
        return True
    
    def update_card_quantity(self, deck_id: int, card_id: int, quantity: int):
        """
        Update the quantity of a card in a deck with validation.
        Enforces the max_occurrence constraint from the Card model.
        """
        # Validate quantity is positive
        if quantity < 1:
            raise ValueError("Quantity must be at least 1")
        
        # Get the card to check max_occurrence
        card = self.card_repo.get(card_id)
        if not card:
            raise ValueError(f"Card with ID {card_id} not found")
        
        # Validate quantity doesn't exceed max_occurrence
        if quantity > card.max_occurrence:
            raise ValueError(
                f"Quantity ({quantity}) exceeds max_occurrence ({card.max_occurrence}) for card '{card.name}'"
            )
        
        # Update quantity
        success = self.deck_repo.update_card_quantity(deck_id, card_id, quantity)
        if not success:
            raise ValueError("Card not found in deck")
        
        return True
    
    def get_deck_cards(self, deck_id: int):
        """Get all cards in a deck with their quantities."""
        return self.deck_repo.get_deck_cards(deck_id)
    
    def get_card_quantity(self, deck_id: int, card_id: int):
        """Get the quantity of a specific card in a deck."""
        quantity = self.deck_repo.get_card_quantity(deck_id, card_id)
        if quantity is None:
            raise ValueError("Card not found in deck")
        return quantity
    
    def get_total_cards(self, deck_id: int):
        """Get the total number of cards in a deck."""
        return self.deck_repo.get_total_cards(deck_id)
    
    def validate_deck(self, deck_id: int) -> dict:
        """
        Validate a deck to ensure all cards respect max_occurrence constraints.
        Returns a dict with validation status and any errors.
        """
        deck_cards = self.deck_repo.get_deck_cards(deck_id)
        errors = []
        
        for item in deck_cards:
            card = item["card"]
            quantity = item["quantity"]
            
            if quantity > card.max_occurrence:
                errors.append({
                    "card_id": card.id,
                    "card_name": card.name,
                    "quantity": quantity,
                    "max_occurrence": card.max_occurrence,
                    "message": f"Card '{card.name}' has quantity {quantity} but max_occurrence is {card.max_occurrence}"
                })
        
        return {
            "valid": len(errors) == 0,
            "total_cards": self.deck_repo.get_total_cards(deck_id),
            "errors": errors
        }
    
