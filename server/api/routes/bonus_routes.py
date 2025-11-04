from fastapi import APIRouter, HTTPException, Query
from pydantic import BaseModel
from server.repositories.bonus_repository import BonusRepository
from server.services.bonus_service import BonusService
from typing import Optional

router = APIRouter(prefix="/api/v1", tags=["bonuses"])

repo = BonusRepository()
service = BonusService(repo)


# Pydantic models for request/response validation
class BonusCreate(BaseModel):
    description: str
    archetype_id: int


class BonusUpdate(BaseModel):
    description: str
    archetype_id: int


class BonusResponse(BaseModel):
    id: int
    description: str
    archetype_id: int

    class Config:
        from_attributes = True


@router.post("/bonuses", response_model=BonusResponse)
def create_bonus(bonus: BonusCreate):
    """Create a new bonus."""
    return service.create_bonus(bonus.description, bonus.archetype_id)


@router.get("/bonuses/{bonus_id}", response_model=BonusResponse)
def get_bonus(bonus_id: int):
    """Get a bonus by ID."""
    result = service.get_bonus(bonus_id)
    if not result:
        raise HTTPException(status_code=404, detail="Bonus not found")
    return result


@router.get("/bonuses", response_model=list[BonusResponse])
def list_bonuses(archetype_id: Optional[int] = Query(None, description="Filter by archetype ID")):
    """Get all bonuses, optionally filtered by archetype."""
    return service.list_bonuses(archetype_id=archetype_id)


@router.put("/bonuses/{bonus_id}", response_model=BonusResponse)
def update_bonus(bonus_id: int, bonus: BonusUpdate):
    """Update a bonus."""
    result = service.update_bonus(bonus_id, bonus.description, bonus.archetype_id)
    if not result:
        raise HTTPException(status_code=404, detail="Bonus not found")
    return result


@router.delete("/bonuses/{bonus_id}")
def delete_bonus(bonus_id: int):
    """Delete a bonus."""
    success = service.delete_bonus(bonus_id)
    if not success:
        raise HTTPException(status_code=404, detail="Bonus not found")
    return {"message": "Bonus deleted successfully"}
