from fastapi import APIRouter, HTTPException, UploadFile, File
from fastapi.responses import FileResponse
from pydantic import BaseModel
from typing import Optional
import os
import uuid
from pathlib import Path
from server.repositories.type_repository import TypeRepository
from server.services.type_service import TypeService

router = APIRouter(prefix="/api/v1", tags=["types"])

repo = TypeRepository()
service = TypeService(repo)

# Icon upload directory
ICONS_DIR = Path("uploads/icons")
ICONS_DIR.mkdir(parents=True, exist_ok=True)


# Pydantic models for request/response validation
class TypeCreate(BaseModel):
    name: str
    icon_path: Optional[str] = None
    color: Optional[str] = None


class TypeUpdate(BaseModel):
    name: str | None = None
    icon_path: str | None = None
    color: str | None = None


class TypeResponse(BaseModel):
    id: int
    name: str
    icon_path: Optional[str] = None
    color: Optional[str] = None

    class Config:
        from_attributes = True


@router.post("/types", response_model=TypeResponse)
def create_type(type_data: TypeCreate):
    """Create a new type."""
    return service.create_type(type_data.name, type_data.icon_path, type_data.color)


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
    """Update a type. If icon_path is being updated, deletes the old icon file."""
    # Get the current type to check for old icon
    current_type = service.get_type(type_id)
    if not current_type:
        raise HTTPException(status_code=404, detail="Type not found")
    
    # If we're updating the icon_path and there was an old icon, delete it
    if type_data.icon_path and current_type.icon_path and type_data.icon_path != current_type.icon_path:
        old_icon_filename = current_type.icon_path.split('/')[-1]
        old_icon_file_path = ICONS_DIR / old_icon_filename
        
        if old_icon_file_path.exists():
            try:
                old_icon_file_path.unlink()  # Delete the old file
                print(f"Deleted old icon file: {old_icon_file_path}")
            except Exception as e:
                print(f"Warning: Failed to delete old icon file {old_icon_file_path}: {str(e)}")
                # Don't fail the request if old file deletion fails
    
    # Update the type
    result = service.update_type(type_id, type_data.name, type_data.icon_path, type_data.color)
    if not result:
        raise HTTPException(status_code=404, detail="Type not found")
    return result


@router.delete("/types/{type_id}")
def delete_type(type_id: int):
    """Delete a type and its associated icon file."""
    # Get the type first to check if it has an icon
    type_obj = service.get_type(type_id)
    if not type_obj:
        raise HTTPException(status_code=404, detail="Type not found")
    
    # Delete the type from database
    success = service.delete_type(type_id)
    if not success:
        raise HTTPException(status_code=404, detail="Type not found")
    
    # Delete the icon file if it exists
    if type_obj.icon_path:
        icon_filename = type_obj.icon_path.split('/')[-1]
        icon_file_path = ICONS_DIR / icon_filename
        
        if icon_file_path.exists():
            try:
                icon_file_path.unlink()  # Delete the file
                print(f"Deleted icon file: {icon_file_path}")
            except Exception as e:
                print(f"Warning: Failed to delete icon file {icon_file_path}: {str(e)}")
                # Don't fail the request if file deletion fails
    
    return {"message": "Type deleted successfully"}


@router.post("/types/upload-icon", response_model=dict)
async def upload_type_icon(file: UploadFile = File(...)):
    """
    Upload an icon for a card type.
    Accepts SVG, PNG, or JPG files.
    Returns the file path to be associated with a type.
    """
    # Validate file type
    allowed_extensions = {".svg", ".png", ".jpg", ".jpeg"}
    file_ext = os.path.splitext(file.filename)[1].lower()
    
    if file_ext not in allowed_extensions:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid file type. Allowed types: {', '.join(allowed_extensions)}"
        )
    
    # Generate unique filename
    unique_filename = f"{uuid.uuid4()}{file_ext}"
    file_path = ICONS_DIR / unique_filename
    
    # Save file
    try:
        contents = await file.read()
        with open(file_path, "wb") as f:
            f.write(contents)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to save icon: {str(e)}")
    
    # Return relative path for storage in database
    relative_path = f"uploads/icons/{unique_filename}"
    return {
        "path": relative_path,
        "filename": unique_filename,
        "original_filename": file.filename
    }


@router.get("/types/icon/{filename}")
async def get_type_icon(filename: str):
    """Serve a type icon file."""
    file_path = ICONS_DIR / filename
    
    if not file_path.exists():
        raise HTTPException(status_code=404, detail="Icon not found")
    
    # Determine media type based on extension
    media_types = {
        ".svg": "image/svg+xml",
        ".png": "image/png",
        ".jpg": "image/jpeg",
        ".jpeg": "image/jpeg"
    }
    ext = file_path.suffix.lower()
    media_type = media_types.get(ext, "application/octet-stream")
    
    return FileResponse(file_path, media_type=media_type)
