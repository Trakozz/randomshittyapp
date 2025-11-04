from server.db.db_config import SessionLocal
from server.db.schema.faction import Faction
from typing import Optional, List
from sqlalchemy import select

class FactionRepository:
    
    def create(self, name: str, archetype_id: int) -> Faction:
        with SessionLocal() as session:
            faction = Faction(name=name, archetype_id=archetype_id)
            session.add(faction)
            session.commit()
            session.refresh(faction)
            return faction
        
    def get(self, faction_id: int) -> Optional[Faction]:
        with SessionLocal() as session:
            return session.get(Faction, faction_id)
    
    def update(self, faction_id: int, name: str, archetype_id: int) -> Optional[Faction]:
        with SessionLocal() as session:
            faction = session.get(Faction, faction_id)
            if not faction:
                return None
            faction.name = name
            faction.archetype_id = archetype_id
            session.commit()
            session.refresh(faction)
            return faction
        
    def delete(self, faction_id: int) -> bool:
        with SessionLocal() as session:
            faction = session.get(Faction, faction_id)
            if not faction:
                return False
            session.delete(faction)
            session.commit()
            return True
        
    def list(self, archetype_id: Optional[int] = None) -> List[Faction]:
        with SessionLocal() as session:
            query = select(Faction)
            if archetype_id is not None:
                query = query.where(Faction.archetype_id == archetype_id)
            result = session.scalars(query).all()
            return result