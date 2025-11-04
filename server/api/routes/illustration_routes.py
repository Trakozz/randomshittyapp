from fastapi import APIRouter, HTTPException, UploadFile, File, Form, Query
from fastapi.responses import FileResponse
from pydantic import BaseModel
from server.repositories.illustration_repository import IllustrationRepository
from server.services.illustration_service import IllustrationService
from typing import Optional
import os

router = APIRouter(prefix="/api/v1", tags=["illustrations"])

repo = IllustrationRepository()
service = IllustrationService(repo)


# Pydantic models for request/response validation
class IllustrationResponse(BaseModel):
    id: int
    filename: str
    original_name: str | None
    archetype_id: int
    url: str

    class Config:
        from_attributes = True


@router.post("/illustrations/upload", response_model=IllustrationResponse)
async def upload_illustration(file: UploadFile = File(...), archetype_id: int = Form(...)):
    """
    Upload an illustration file.
    
    Accepts: JPG, JPEG, PNG, GIF, WEBP
    Max size: 10MB (configurable)
    Returns: Illustration metadata with URL
    """
    # Validate file type
    allowed_types = ["image/jpeg", "image/jpg", "image/png", "image/gif", "image/webp"]
    if file.content_type not in allowed_types:
        raise HTTPException(
            status_code=400, 
            detail=f"Invalid file type. Allowed: {', '.join(allowed_types)}"
        )
    
    # Validate file size (10MB limit)
    max_size = 10 * 1024 * 1024  # 10MB
    contents = await file.read()
    if len(contents) > max_size:
        raise HTTPException(status_code=400, detail="File too large. Maximum size: 10MB")
    
    # Save file and create database entry
    illustration = await service.save_uploaded_file(file.filename, archetype_id, contents)
    
    # Return response with URL
    return {
        "id": illustration.id,
        "filename": illustration.filename,
        "original_name": illustration.original_name,
        "archetype_id": illustration.archetype_id,
        "url": f"/api/v1/illustrations/{illustration.id}/file"
    }


@router.get("/illustrations/{illustration_id}/file")
async def get_illustration_file(illustration_id: int):
    """Serve the actual illustration file."""
    illustration = service.get_illustration(illustration_id)
    if not illustration:
        raise HTTPException(status_code=404, detail="Illustration not found")
    
    file_path = service.get_file_path(illustration.filename, illustration.archetype_id)
    if not os.path.exists(file_path):
        raise HTTPException(status_code=404, detail="File not found on disk")
    
    return FileResponse(file_path)


@router.get("/illustrations/{illustration_id}", response_model=IllustrationResponse)
def get_illustration(illustration_id: int):
    """Get illustration metadata by ID."""
    result = service.get_illustration(illustration_id)
    if not result:
        raise HTTPException(status_code=404, detail="Illustration not found")
    return {
        "id": result.id,
        "filename": result.filename,
        "original_name": result.original_name,
        "archetype_id": result.archetype_id,
        "url": f"/api/v1/illustrations/{result.id}/file"
    }


@router.get("/illustrations", response_model=list[IllustrationResponse])
def list_illustrations(archetype_id: Optional[int] = Query(None, description="Filter by archetype ID")):
    """Get all illustrations, optionally filtered by archetype."""
    illustrations = service.list_illustrations(archetype_id=archetype_id)
    return [
        {
            "id": ill.id,
            "filename": ill.filename,
            "original_name": ill.original_name,
            "archetype_id": ill.archetype_id,
            "url": f"/api/v1/illustrations/{ill.id}/file"
        }
        for ill in illustrations
    ]


@router.delete("/illustrations/{illustration_id}")
def delete_illustration(illustration_id: int):
    """Delete an illustration and its file."""
    success = service.delete_illustration(illustration_id)
    if not success:
        raise HTTPException(status_code=404, detail="Illustration not found")
    return {"message": "Illustration deleted successfully"}
