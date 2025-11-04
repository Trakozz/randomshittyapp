from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from server.repositories.archetype_repository import ArchetypeRepository
from server.services.archetype_service import ArchetypeService

router = APIRouter(prefix="/api/v1", tags=["archetypes"])

repo = ArchetypeRepository()
service = ArchetypeService(repo)


# Pydantic models for request/response validation
class ArchetypeCreate(BaseModel):
    name: str


class ArchetypeUpdate(BaseModel):
    name: str


class ArchetypeResponse(BaseModel):
    id: int
    name: str

    class Config:
        from_attributes = True


@router.post("/archetypes", response_model=ArchetypeResponse)
def create_archetype(archetype: ArchetypeCreate):
    """Create a new archetype."""
    return service.create_archetype(archetype.name)


@router.get("/archetypes/{archetype_id}", response_model=ArchetypeResponse)
def get_archetype(archetype_id: int):
    """Get an archetype by ID."""
    result = service.get_archetype(archetype_id)
    if not result:
        raise HTTPException(status_code=404, detail="Archetype not found")
    return result


@router.get("/archetypes", response_model=list[ArchetypeResponse])
def list_archetypes():
    """Get all archetypes."""
    return service.list_archetypes()


@router.put("/archetypes/{archetype_id}", response_model=ArchetypeResponse)
def update_archetype(archetype_id: int, archetype: ArchetypeUpdate):
    """Update an archetype."""
    result = service.update_archetype(archetype_id, archetype.name)
    if not result:
        raise HTTPException(status_code=404, detail="Archetype not found")
    return result


@router.delete("/archetypes/{archetype_id}")
def delete_archetype(archetype_id: int):
    """Delete an archetype."""
    success = service.delete_archetype(archetype_id)
    if not success:
        raise HTTPException(status_code=404, detail="Archetype not found")
    return {"message": "Archetype deleted successfully"}
