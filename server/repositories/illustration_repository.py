from server.db.db_config import SessionLocal
from server.db.schema.illustration import Illustration
from typing import Optional, List
from sqlalchemy import select

class IllustrationRepository:
    
    def create(self, filename: str, archetype_id: int, original_name: str | None = None) -> Illustration:
        """Create a new illustration with a given filename."""
        with SessionLocal() as session:
            illustration = Illustration(
                filename=filename,
                original_name=original_name,
                archetype_id=archetype_id
            )
            session.add(illustration)
            session.commit()
            session.refresh(illustration)
            return illustration
        
    def get(self, illustration_id: int) -> Optional[Illustration]:
        """Retrieve an illustration by its ID."""
        with SessionLocal() as session:
            illustration = session.get(Illustration, illustration_id)
            if illustration:
                # Detach from session to avoid lazy loading issues
                session.expunge(illustration)
            return illustration
    
    def get_by_filename(self, filename: str) -> Optional[Illustration]:
        """Retrieve an illustration by its filename."""
        with SessionLocal() as session:
            result = session.scalars(
                select(Illustration).where(Illustration.filename == filename)
            ).first()
            if result:
                session.expunge(result)
            return result
    
    def list(self, archetype_id: Optional[int] = None) -> List[Illustration]:
        """Return all illustrations, optionally filtered by archetype."""
        with SessionLocal() as session:
            query = select(Illustration)
            if archetype_id is not None:
                query = query.where(Illustration.archetype_id == archetype_id)
            result = session.scalars(query).all()
            # Detach all from session
            for ill in result:
                session.expunge(ill)
            return list(result)
        
    def delete(self, illustration_id: int) -> Optional[Illustration]:
        """Delete an illustration by its ID and return it."""
        with SessionLocal() as session:
            illustration = session.get(Illustration, illustration_id)
            if not illustration:
                return None
            # Store info before deletion
            filename = illustration.filename
            archetype_id = illustration.archetype_id
            session.delete(illustration)
            session.commit()
            # Return detached object with filename for cleanup
            deleted = Illustration(filename=filename, archetype_id=archetype_id)
            deleted.id = illustration_id
            return deleted
