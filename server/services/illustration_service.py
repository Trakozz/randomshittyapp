from server.repositories.illustration_repository import IllustrationRepository
import os
import uuid
from pathlib import Path
import shutil

class IllustrationService:
    def __init__(self, repo: IllustrationRepository):
        self.repo = repo
        self.upload_dir = self._get_upload_directory()
        self._ensure_upload_directory()

    def _get_upload_directory(self, archetype_id: int = None) -> Path:
        """Get the upload directory path, optionally for a specific archetype."""
        # Store uploads in a directory relative to project root
        base_dir = Path(__file__).resolve().parent.parent.parent
        base_upload_dir = base_dir / "uploads" / "illustrations"
        
        if archetype_id is not None:
            return base_upload_dir / f"archetype_{archetype_id}"
        return base_upload_dir
    
    def _ensure_upload_directory(self, archetype_id: int = None):
        """Create upload directory if it doesn't exist."""
        upload_dir = self._get_upload_directory(archetype_id)
        upload_dir.mkdir(parents=True, exist_ok=True)
    
    def _generate_unique_filename(self, original_filename: str) -> str:
        """Generate a unique filename while preserving extension."""
        extension = os.path.splitext(original_filename)[1].lower()
        unique_name = f"{uuid.uuid4()}{extension}"
        return unique_name
    
    def get_file_path(self, filename: str, archetype_id: int) -> str:
        """Get the full file path for a filename."""
        upload_dir = self._get_upload_directory(archetype_id)
        return str(upload_dir / filename)
    
    async def save_uploaded_file(self, original_filename: str, archetype_id: int, file_contents: bytes):
        """
        Save an uploaded file to disk and create database entry.
        
        Args:
            original_filename: The original name of the uploaded file
            archetype_id: The archetype this illustration belongs to
            file_contents: The file contents as bytes
            
        Returns:
            Illustration object with database metadata
        """
        # Ensure archetype directory exists
        self._ensure_upload_directory(archetype_id)
        
        # Generate unique filename
        unique_filename = self._generate_unique_filename(original_filename)
        upload_dir = self._get_upload_directory(archetype_id)
        file_path = upload_dir / unique_filename
        
        # Write file to disk
        with open(file_path, "wb") as f:
            f.write(file_contents)
        
        # Create database entry
        illustration = self.repo.create(
            filename=unique_filename,
            archetype_id=archetype_id,
            original_name=original_filename
        )
        
        return illustration

    def get_illustration(self, illustration_id: int):
        """Get illustration metadata by ID."""
        return self.repo.get(illustration_id)

    def list_illustrations(self, archetype_id: int = None):
        """List all illustrations, optionally filtered by archetype."""
        return self.repo.list(archetype_id)
    
    def delete_illustration(self, illustration_id: int) -> bool:
        """Delete illustration from database and disk."""
        illustration = self.repo.delete(illustration_id)
        if not illustration:
            return False
        
        # Delete file from disk
        upload_dir = self._get_upload_directory(illustration.archetype_id)
        file_path = upload_dir / illustration.filename
        if file_path.exists():
            try:
                os.remove(file_path)
            except Exception as e:
                print(f"Warning: Could not delete file {file_path}: {e}")
        
        return True
