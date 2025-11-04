from typing import List, Optional
from sqlalchemy import select
from server.db.schema.archetype import Archetype
from server.db.db_config import SessionLocal


class ArchetypeRepository:
    

    def create(self, name: str) -> Archetype:
        """Create a new archetype with a given name."""
        with SessionLocal() as session:
            archetype = Archetype(name=name)
            session.add(archetype)
            session.commit()
            session.refresh(archetype)
            return archetype

    def get(self, archetype_id: int) -> Optional[Archetype]:
        with SessionLocal() as session:
            return session.get(Archetype, archetype_id)

    def list(self) -> List[Archetype]:
        """Return all archetypes in the database."""
        with SessionLocal() as session:
            result = session.scalars(select(Archetype)).all()
            return result

    def get_by_name(self, name: str) -> Optional[Archetype]:
        """Return an archetype by its name."""
        with SessionLocal() as session:
            stmt = select(Archetype).where(Archetype.name == name)
            return session.scalars(stmt).first()

    def update(self, archetype_id: int, name: str) -> Optional[Archetype]:
        with SessionLocal() as session:
            archetype = session.get(Archetype, archetype_id)
            if not archetype:
                return None
            archetype.name = name
            session.commit()
            session.refresh(archetype)
            return archetype

    def delete(self, archetype_id: int) -> bool:
        with SessionLocal() as session:
            archetype = session.get(Archetype, archetype_id)
            if not archetype:
                return False
            session.delete(archetype)
            session.commit()
            return True