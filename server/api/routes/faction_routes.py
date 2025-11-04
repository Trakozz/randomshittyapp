from fastapi import APIRouter, HTTPException, Query
from pydantic import BaseModel
from server.repositories.faction_repository import FactionRepository
from server.services.faction_service import FactionService
from typing import Optional

router = APIRouter(prefix="/api/v1", tags=["factions"])

repo = FactionRepository()
service = FactionService(repo)


# Pydantic models for request/response validation
class FactionCreate(BaseModel):
    name: str
    archetype_id: int


class FactionUpdate(BaseModel):
    name: str
    archetype_id: int


class FactionResponse(BaseModel):
    id: int
    name: str
    archetype_id: int

    class Config:
        from_attributes = True


@router.post("/factions", response_model=FactionResponse)
def create_faction(faction: FactionCreate):
    """Create a new faction."""
    return service.create_faction(faction.name, faction.archetype_id)


@router.get("/factions/{faction_id}", response_model=FactionResponse)
def get_faction(faction_id: int):
    """Get a faction by ID."""
    result = service.get_faction(faction_id)
    if not result:
        raise HTTPException(status_code=404, detail="Faction not found")
    return result


@router.get("/factions", response_model=list[FactionResponse])
def list_factions(archetype_id: Optional[int] = Query(None, description="Filter by archetype ID")):
    """Get all factions, optionally filtered by archetype."""
    return service.list_factions(archetype_id=archetype_id)


@router.put("/factions/{faction_id}", response_model=FactionResponse)
def update_faction(faction_id: int, faction: FactionUpdate):
    """Update a faction."""
    result = service.update_faction(faction_id, faction.name, faction.archetype_id)
    if not result:
        raise HTTPException(status_code=404, detail="Faction not found")
    return result


@router.delete("/factions/{faction_id}")
def delete_faction(faction_id: int):
    """Delete a faction."""
    success = service.delete_faction(faction_id)
    if not success:
        raise HTTPException(status_code=404, detail="Faction not found")
    return {"message": "Faction deleted successfully"}
