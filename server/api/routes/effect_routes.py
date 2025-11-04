from fastapi import APIRouter, HTTPException, Query
from pydantic import BaseModel
from server.repositories.effect_repository import EffectRepository
from server.services.effect_service import EffectService
from typing import Optional

router = APIRouter(prefix="/api/v1", tags=["effects"])

repo = EffectRepository()
service = EffectService(repo)


# Pydantic models for request/response validation
class EffectCreate(BaseModel):
    name: str
    description: str
    archetype_id: int
    effect_type_id: Optional[int] = None


class EffectUpdate(BaseModel):
    name: str
    description: str
    archetype_id: int
    effect_type_id: Optional[int] = None


class EffectResponse(BaseModel):
    id: int
    name: str
    description: str
    archetype_id: int
    effect_type_id: Optional[int] = None

    class Config:
        from_attributes = True


@router.post("/effects", response_model=EffectResponse)
def create_effect(effect: EffectCreate):
    """Create a new effect."""
    return service.create_effect(
        name=effect.name,
        description=effect.description,
        archetype_id=effect.archetype_id,
        effect_type_id=effect.effect_type_id
    )


@router.get("/effects/{effect_id}", response_model=EffectResponse)
def get_effect(effect_id: int):
    """Get an effect by ID."""
    result = service.get_effect(effect_id)
    if not result:
        raise HTTPException(status_code=404, detail="Effect not found")
    return result


@router.get("/effects", response_model=list[EffectResponse])
def list_effects(archetype_id: Optional[int] = Query(None, description="Filter by archetype ID")):
    """Get all effects, optionally filtered by archetype."""
    return service.list_effects(archetype_id=archetype_id)


@router.put("/effects/{effect_id}", response_model=EffectResponse)
def update_effect(effect_id: int, effect: EffectUpdate):
    """Update an effect."""
    result = service.update_effect(
        effect_id,
        name=effect.name,
        description=effect.description,
        archetype_id=effect.archetype_id,
        effect_type_id=effect.effect_type_id
    )
    if not result:
        raise HTTPException(status_code=404, detail="Effect not found")
    return result


@router.delete("/effects/{effect_id}")
def delete_effect(effect_id: int):
    """Delete an effect."""
    success = service.delete_effect(effect_id)
    if not success:
        raise HTTPException(status_code=404, detail="Effect not found")
    return {"message": "Effect deleted successfully"}
