from server.db.db_config import SessionLocal
from server.db.schema.effect import Effect
from typing import Optional, List
from sqlalchemy import select


class EffectRepository:

    def create(self, name: str, description: str, archetype_id: int, effect_type_id: Optional[int] = None) -> Effect:
        """Create a new card effect."""
        with SessionLocal() as session:
            effect = Effect(
                name=name,
                description=description,
                archetype_id=archetype_id,
                effect_type_id=effect_type_id
            )
            session.add(effect)
            session.commit()
            session.refresh(effect)
            return effect

    def get(self, effect_id: int) -> Optional[Effect]:
        """Retrieve an effect by its ID."""
        with SessionLocal() as session:
            return session.get(Effect, effect_id)

    def update(self, effect_id: int, name: str, description: str, archetype_id: int, effect_type_id: Optional[int] = None) -> Optional[Effect]:
        """Update an effect."""
        with SessionLocal() as session:
            effect = session.get(Effect, effect_id)
            if not effect:
                return None
            effect.name = name
            effect.description = description
            effect.archetype_id = archetype_id
            effect.effect_type_id = effect_type_id
            session.commit()
            session.refresh(effect)
            return effect

    def delete(self, effect_id: int) -> bool:
        """Delete an effect by its ID."""
        with SessionLocal() as session:
            effect = session.get(Effect, effect_id)
            if not effect:
                return False
            session.delete(effect)
            session.commit()
            return True

    def list(self, archetype_id: Optional[int] = None) -> List[Effect]:
        """Return all effects, optionally filtered by archetype."""
        with SessionLocal() as session:
            query = select(Effect)
            if archetype_id is not None:
                query = query.where(Effect.archetype_id == archetype_id)
            result = session.scalars(query).all()
            return result
