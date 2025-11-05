from fastapi import APIRouter, HTTPException, Query
from pydantic import BaseModel, Field, computed_field
from typing import Optional, List
from server.repositories.deck_repository import DeckRepository
from server.services.deck_service import DeckService

router = APIRouter(prefix="/api/v1", tags=["decks"])

deck_repo = DeckRepository()
service = DeckService(deck_repo)


# Pydantic models for request/response validation
class TypeInCard(BaseModel):
    id: int
    name: str
    icon_path: Optional[str] = None
    
    class Config:
        from_attributes = True


class ArchetypeInCard(BaseModel):
    id: int
    name: str
    
    class Config:
        from_attributes = True


class FactionInCard(BaseModel):
    id: int
    name: str
    
    class Config:
        from_attributes = True


class IllustrationInCard(BaseModel):
    id: int
    filename: str
    original_name: Optional[str] = None
    archetype_id: int
    
    @computed_field
    @property
    def url(self) -> str:
        """Computed URL path for the illustration"""
        return f"/uploads/illustrations/archetype_{self.archetype_id}/{self.filename}"
    
    class Config:
        from_attributes = True


class DeckCreate(BaseModel):
    name: str = Field(..., min_length=1, max_length=100)
    description: Optional[str] = None
    archetype_id: int = Field(..., gt=0)


class DeckUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=1, max_length=100)
    description: Optional[str] = None
    archetype_id: Optional[int] = Field(None, gt=0)


class DeckResponse(BaseModel):
    id: int
    name: str
    description: Optional[str]
    archetype_id: int
    archetype: Optional[ArchetypeInCard] = None

    class Config:
        from_attributes = True


class CardInDeckResponse(BaseModel):
    id: int
    name: str
    archetype_id: int
    type_id: int
    faction_id: int
    cost: int
    combat_power: int
    resilience: int
    illustration_id: Optional[int]
    max_occurrence: int
    description: Optional[str]
    type: Optional[TypeInCard] = None
    archetype: Optional[ArchetypeInCard] = None
    faction: Optional[FactionInCard] = None
    illustration: Optional[IllustrationInCard] = None

    class Config:
        from_attributes = True


class DeckCardResponse(BaseModel):
    card: CardInDeckResponse
    quantity: int
    count: int  # Alias for quantity


class AddCardToDeck(BaseModel):
    card_id: int = Field(..., gt=0)
    quantity: int = Field(..., ge=1)


class UpdateCardQuantity(BaseModel):
    quantity: int = Field(..., ge=1)


class DeckValidationError(BaseModel):
    card_id: int
    card_name: str
    quantity: int
    max_occurrence: int
    message: str


class DeckValidationResponse(BaseModel):
    valid: bool
    total_cards: int
    errors: List[DeckValidationError]


# Deck CRUD endpoints
@router.post("/decks", response_model=DeckResponse, status_code=201)
def create_deck(deck: DeckCreate):
    """Create a new deck."""
    return service.create_deck(name=deck.name, archetype_id=deck.archetype_id, description=deck.description)


@router.get("/decks/{deck_id}", response_model=DeckResponse)
def get_deck(
    deck_id: int,
    load_cards: bool = Query(False, description="Load cards in deck")
):
    """Get a deck by ID."""
    result = service.get_deck(deck_id, load_cards=load_cards)
    if not result:
        raise HTTPException(status_code=404, detail="Deck not found")
    return result


@router.get("/decks", response_model=List[DeckResponse])
def list_decks(
    load_cards: bool = Query(False, description="Load cards for all decks")
):
    """Get all decks."""
    return service.list_decks(load_cards=load_cards)


@router.put("/decks/{deck_id}", response_model=DeckResponse)
def update_deck(deck_id: int, deck: DeckUpdate):
    """Update a deck's attributes."""
    result = service.update_deck(
        deck_id=deck_id,
        name=deck.name,
        description=deck.description,
        archetype_id=deck.archetype_id
    )
    if not result:
        raise HTTPException(status_code=404, detail="Deck not found")
    return result


@router.delete("/decks/{deck_id}")
def delete_deck(deck_id: int):
    """Delete a deck."""
    success = service.delete_deck(deck_id)
    if not success:
        raise HTTPException(status_code=404, detail="Deck not found")
    return {"message": "Deck deleted successfully"}


# Deck-Card relationship endpoints
@router.post("/decks/{deck_id}/cards")
def add_card_to_deck(deck_id: int, card_data: AddCardToDeck):
    """
    Add a card to a deck with specified quantity.
    Validates that quantity doesn't exceed the card's max_occurrence.
    """
    try:
        service.add_card_to_deck(deck_id, card_data.card_id, card_data.quantity)
        return {
            "message": "Card added to deck successfully",
            "card_id": card_data.card_id,
            "quantity": card_data.quantity
        }
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.delete("/decks/{deck_id}/cards/{card_id}")
def remove_card_from_deck(deck_id: int, card_id: int):
    """Remove a card from a deck."""
    try:
        service.remove_card_from_deck(deck_id, card_id)
        return {"message": "Card removed from deck successfully"}
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))


@router.put("/decks/{deck_id}/cards/{card_id}")
def update_card_quantity(deck_id: int, card_id: int, quantity_data: UpdateCardQuantity):
    """
    Update the quantity of a card in a deck.
    Validates that quantity doesn't exceed the card's max_occurrence.
    """
    try:
        service.update_card_quantity(deck_id, card_id, quantity_data.quantity)
        return {
            "message": "Card quantity updated successfully",
            "card_id": card_id,
            "quantity": quantity_data.quantity
        }
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.get("/decks/{deck_id}/cards", response_model=List[DeckCardResponse])
def get_deck_cards(deck_id: int):
    """Get all cards in a deck with their quantities."""
    cards = service.get_deck_cards(deck_id)
    if cards is None:
        raise HTTPException(status_code=404, detail="Deck not found")
    return cards


@router.get("/decks/{deck_id}/cards/{card_id}/quantity")
def get_card_quantity(deck_id: int, card_id: int):
    """Get the quantity of a specific card in a deck."""
    try:
        quantity = service.get_card_quantity(deck_id, card_id)
        return {
            "deck_id": deck_id,
            "card_id": card_id,
            "quantity": quantity
        }
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))


@router.get("/decks/{deck_id}/total")
def get_total_cards(deck_id: int):
    """Get the total number of cards in a deck (sum of all quantities)."""
    total = service.get_total_cards(deck_id)
    return {
        "deck_id": deck_id,
        "total_cards": total
    }


@router.get("/decks/{deck_id}/validate", response_model=DeckValidationResponse)
def validate_deck(deck_id: int):
    """
    Validate a deck to ensure all cards respect max_occurrence constraints.
    Returns validation status and any errors found.
    """
    validation_result = service.validate_deck(deck_id)
    return validation_result