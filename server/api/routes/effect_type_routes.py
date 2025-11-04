from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from server.repositories.effect_type_repository import EffectTypeRepository
from server.services.effect_type_service import EffectTypeService

router = APIRouter(prefix="/api/v1", tags=["effect_types"])

repo = EffectTypeRepository()
service = EffectTypeService(repo)


# Pydantic models for request/response validation
class EffectTypeCreate(BaseModel):
    name: str


class EffectTypeUpdate(BaseModel):
    name: str


class EffectTypeResponse(BaseModel):
    id: int
    name: str

    class Config:
        from_attributes = True


@router.post("/effect_types", response_model=EffectTypeResponse)
def create_effect_type(effect_type: EffectTypeCreate):
    """Create a new effect type."""
    result = service.create_effect_type(name=effect_type.name)
    return result


@router.get("/effect_types/{effect_type_id}", response_model=EffectTypeResponse)
def get_effect_type(effect_type_id: int):
    """Get an effect type by ID."""
    result = service.get_effect_type(effect_type_id)
    if not result:
        raise HTTPException(status_code=404, detail="Effect type not found")
    return result


@router.get("/effect_types", response_model=list[EffectTypeResponse])
def list_effect_types():
    """Get all effect types."""
    return service.list_effect_types()


@router.put("/effect_types/{effect_type_id}", response_model=EffectTypeResponse)
def update_effect_type(effect_type_id: int, effect_type: EffectTypeUpdate):
    """Update an effect type."""
    result = service.update_effect_type(effect_type_id, name=effect_type.name)
    if not result:
        raise HTTPException(status_code=404, detail="Effect type not found")
    return result


@router.delete("/effect_types/{effect_type_id}")
def delete_effect_type(effect_type_id: int):
    """Delete an effect type."""
    result = service.delete_effect_type(effect_type_id)
    if not result:
        raise HTTPException(status_code=404, detail="Effect type not found")
    return {"message": "Effect type deleted successfully"}
