from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from server.repositories.type_repository import TypeRepository
from server.services.type_service import TypeService

router = APIRouter(prefix="/api/v1", tags=["types"])

repo = TypeRepository()
service = TypeService(repo)


# Pydantic models for request/response validation
class TypeCreate(BaseModel):
    name: str


class TypeUpdate(BaseModel):
    name: str


class TypeResponse(BaseModel):
    id: int
    name: str

    class Config:
        from_attributes = True


@router.post("/types", response_model=TypeResponse)
def create_type(type_data: TypeCreate):
    """Create a new type."""
    return service.create_type(type_data.name)


@router.get("/types/{type_id}", response_model=TypeResponse)
def get_type(type_id: int):
    """Get a type by ID."""
    result = service.get_type(type_id)
    if not result:
        raise HTTPException(status_code=404, detail="Type not found")
    return result


@router.get("/types", response_model=list[TypeResponse])
def list_types():
    """Get all types."""
    return service.list_types()


@router.put("/types/{type_id}", response_model=TypeResponse)
def update_type(type_id: int, type_data: TypeUpdate):
    """Update a type."""
    result = service.update_type(type_id, type_data.name)
    if not result:
        raise HTTPException(status_code=404, detail="Type not found")
    return result


@router.delete("/types/{type_id}")
def delete_type(type_id: int):
    """Delete a type."""
    success = service.delete_type(type_id)
    if not success:
        raise HTTPException(status_code=404, detail="Type not found")
    return {"message": "Type deleted successfully"}
