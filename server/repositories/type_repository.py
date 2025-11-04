from server.db.db_config import SessionLocal
from server.db.schema.type import Type
from typing import Optional, List
from sqlalchemy import select

class TypeRepository:
    
    def create(self, name: str, icon_path: Optional[str] = None) -> Type:
        """Create a new type with a given name and optional icon."""
        with SessionLocal() as session:
            type_obj = Type(name=name, icon_path=icon_path)
            session.add(type_obj)
            session.commit()
            session.refresh(type_obj)
            return type_obj
        
    def get(self, type_id: int) -> Optional[Type]:
        """Retrieve a type by its ID."""
        with SessionLocal() as session:
            return session.get(Type, type_id)
    
    def list(self) -> List[Type]:
        """Return all types in the database."""
        with SessionLocal() as session:
            result = session.scalars(select(Type)).all()
            return result
    
    def update(self, type_id: int, name: Optional[str] = None, icon_path: Optional[str] = None) -> Optional[Type]:
        """Update a type's name and/or icon path."""
        with SessionLocal() as session:
            type_obj = session.get(Type, type_id)
            if not type_obj:
                return None
            if name is not None:
                type_obj.name = name
            if icon_path is not None:
                type_obj.icon_path = icon_path
            session.commit()
            session.refresh(type_obj)
            return type_obj
        
    def delete(self, type_id: int) -> bool:
        """Delete a type by its ID."""
        with SessionLocal() as session:
            type_obj = session.get(Type, type_id)
            if not type_obj:
                return False
            session.delete(type_obj)
            session.commit()
            return True
