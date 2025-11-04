from fastapi import APIRouter, HTTPException, Query
from pydantic import BaseModel, Field
from typing import Optional, List
from server.repositories.card_repository import CardRepository
from server.services.card_service import CardService

router = APIRouter(prefix="/api/v1", tags=["cards"])

repo = CardRepository()
service = CardService(repo)


# Pydantic models for request/response validation
class CardCreate(BaseModel):
    name: str = Field(..., min_length=1, max_length=100)
    archetype_id: int = Field(..., gt=0)
    type_id: int = Field(..., gt=0)
    faction_id: int = Field(..., gt=0)
    cost: int = Field(..., ge=0)
    combat_power: int = Field(..., ge=0)
    resilience: int = Field(..., ge=0)
    max_occurrence: int = Field(..., ge=1)
    illustration_id: Optional[int] = Field(None, gt=0)
    description: Optional[str] = None
    effect_ids: List[int] = Field(default_factory=list)
    bonus_ids: List[int] = Field(default_factory=list)


class CardUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=1, max_length=100)
    archetype_id: Optional[int] = Field(None, gt=0)
    type_id: Optional[int] = Field(None, gt=0)
    faction_id: Optional[int] = Field(None, gt=0)
    cost: Optional[int] = Field(None, ge=0)
    combat_power: Optional[int] = Field(None, ge=0)
    resilience: Optional[int] = Field(None, ge=0)
    max_occurrence: Optional[int] = Field(None, ge=1)
    illustration_id: Optional[int] = Field(None, gt=0)
    description: Optional[str] = None
    effect_ids: Optional[List[int]] = None
    bonus_ids: Optional[List[int]] = None


class EffectResponse(BaseModel):
    id: int
    description: str

    class Config:
        from_attributes = True


class BonusResponse(BaseModel):
    id: int
    description: str

    class Config:
        from_attributes = True


class CardResponse(BaseModel):
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
    effects: Optional[List[EffectResponse]] = None
    bonuses: Optional[List[BonusResponse]] = None

    class Config:
        from_attributes = True


class EffectAssociation(BaseModel):
    effect_id: int = Field(..., gt=0)


class BonusAssociation(BaseModel):
    bonus_id: int = Field(..., gt=0)


# Card CRUD endpoints
@router.post("/cards", response_model=CardResponse, status_code=201)
def create_card(card: CardCreate):
    """Create a new card with all attributes and associate effects/bonuses."""
    try:
        return service.create_card(
            name=card.name,
            archetype_id=card.archetype_id,
            type_id=card.type_id,
            faction_id=card.faction_id,
            cost=card.cost,
            combat_power=card.combat_power,
            resilience=card.resilience,
            max_occurrence=card.max_occurrence,
            illustration_id=card.illustration_id,
            description=card.description,
            effect_ids=card.effect_ids,
            bonus_ids=card.bonus_ids
        )
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.get("/cards/{card_id}", response_model=CardResponse)
def get_card(
    card_id: int,
    load_relationships: bool = Query(False, description="Load effects and bonuses")
):
    """Get a card by ID, optionally with effects and bonuses."""
    result = service.get_card(card_id, load_relationships=load_relationships)
    if not result:
        raise HTTPException(status_code=404, detail="Card not found")
    return result


@router.get("/cards", response_model=List[CardResponse])
def list_cards(
    archetype_id: Optional[int] = Query(None, description="Filter cards by archetype ID"),
    load_relationships: bool = Query(False, description="Load effects and bonuses for all cards")
):
    """Get cards, optionally filtered by archetype and with effects and bonuses."""
    return service.list_cards(archetype_id=archetype_id, load_relationships=load_relationships)


@router.put("/cards/{card_id}", response_model=CardResponse)
def update_card(card_id: int, card: CardUpdate):
    """Update a card's attributes."""
    try:
        result = service.update_card(
            card_id=card_id,
            name=card.name,
            archetype_id=card.archetype_id,
            type_id=card.type_id,
            faction_id=card.faction_id,
            cost=card.cost,
            combat_power=card.combat_power,
            resilience=card.resilience,
            max_occurrence=card.max_occurrence,
            illustration_id=card.illustration_id,
            description=card.description
        )
        if not result:
            raise HTTPException(status_code=404, detail="Card not found")
        return result
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.delete("/cards/{card_id}")
def delete_card(card_id: int):
    """Delete a card."""
    success = service.delete_card(card_id)
    if not success:
        raise HTTPException(status_code=404, detail="Card not found")
    return {"message": "Card deleted successfully"}


# Card Effects endpoints
@router.post("/cards/{card_id}/effects")
def add_effect_to_card(card_id: int, effect: EffectAssociation):
    """Add an effect to a card."""
    success = service.add_effect_to_card(card_id, effect.effect_id)
    if not success:
        raise HTTPException(status_code=404, detail="Card or Effect not found")
    return {"message": "Effect added to card successfully"}


@router.delete("/cards/{card_id}/effects/{effect_id}")
def remove_effect_from_card(card_id: int, effect_id: int):
    """Remove an effect from a card."""
    success = service.remove_effect_from_card(card_id, effect_id)
    if not success:
        raise HTTPException(status_code=404, detail="Card-Effect association not found")
    return {"message": "Effect removed from card successfully"}


@router.get("/cards/{card_id}/effects", response_model=List[EffectResponse])
def get_card_effects(card_id: int):
    """Get all effects for a card."""
    effects = service.get_card_effects(card_id)
    return effects


# Card Bonuses endpoints
@router.post("/cards/{card_id}/bonuses")
def add_bonus_to_card(card_id: int, bonus: BonusAssociation):
    """Add a bonus to a card."""
    success = service.add_bonus_to_card(card_id, bonus.bonus_id)
    if not success:
        raise HTTPException(status_code=404, detail="Card or Bonus not found")
    return {"message": "Bonus added to card successfully"}


@router.delete("/cards/{card_id}/bonuses/{bonus_id}")
def remove_bonus_from_card(card_id: int, bonus_id: int):
    """Remove a bonus from a card."""
    success = service.remove_bonus_from_card(card_id, bonus_id)
    if not success:
        raise HTTPException(status_code=404, detail="Card-Bonus association not found")
    return {"message": "Bonus removed from card successfully"}


@router.get("/cards/{card_id}/bonuses", response_model=List[BonusResponse])
def get_card_bonuses(card_id: int):
    """Get all bonuses for a card."""
    bonuses = service.get_card_bonuses(card_id)
    return bonuses