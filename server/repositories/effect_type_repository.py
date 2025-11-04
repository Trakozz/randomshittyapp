from server.db.db_config import SessionLocal
from server.db.schema.effect_type import EffectType
from typing import Optional, List
from sqlalchemy import select


class EffectTypeRepository:
    def get(self, effect_type_id: int) -> Optional[EffectType]:
        """Get an effect type by ID."""
        with SessionLocal() as session:
            return session.get(EffectType, effect_type_id)

    def list(self) -> List[EffectType]:
        """List all effect types."""
        with SessionLocal() as session:
            result = session.scalars(select(EffectType)).all()
            return result

    def create(self, name: str) -> EffectType:
        """Create a new effect type."""
        with SessionLocal() as session:
            effect_type = EffectType(name=name)
            session.add(effect_type)
            session.commit()
            session.refresh(effect_type)
            return effect_type

    def update(self, effect_type_id: int, name: str) -> Optional[EffectType]:
        """Update an effect type."""
        with SessionLocal() as session:
            effect_type = session.get(EffectType, effect_type_id)
            if not effect_type:
                return None
            effect_type.name = name
            session.commit()
            session.refresh(effect_type)
            return effect_type

    def delete(self, effect_type_id: int) -> bool:
        """Delete an effect type."""
        with SessionLocal() as session:
            effect_type = session.get(EffectType, effect_type_id)
            if not effect_type:
                return False
            session.delete(effect_type)
            session.commit()
            return True
