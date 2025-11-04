from server.db.db_config import SessionLocal
from server.db.schema.bonus import Bonus
from typing import Optional, List
from sqlalchemy import select

class BonusRepository:
    
    def create(self, description: str, archetype_id: int) -> Bonus:
        with SessionLocal() as session:
            bonus = Bonus(description=description, archetype_id=archetype_id)
            session.add(bonus)
            session.commit()
            session.refresh(bonus)
            return bonus
        
    def get(self, bonus_id: int) -> Optional[Bonus]:
        with SessionLocal() as session:
            return session.get(Bonus, bonus_id)
    
    def update(self, bonus_id: int, description: str, archetype_id: int) -> Optional[Bonus]:
        with SessionLocal() as session:
            bonus = session.get(Bonus, bonus_id)
            if not bonus:
                return None
            bonus.description = description
            bonus.archetype_id = archetype_id
            session.commit()
            session.refresh(bonus)
            return bonus
        
    def delete(self, bonus_id: int) -> bool:
        with SessionLocal() as session:
            bonus = session.get(Bonus, bonus_id)
            if not bonus:
                return False
            session.delete(bonus)
            session.commit()
            return True
        
    def list(self, archetype_id: Optional[int] = None) -> List[Bonus]:
        with SessionLocal() as session:
            query = select(Bonus)
            if archetype_id is not None:
                query = query.where(Bonus.archetype_id == archetype_id)
            result = session.scalars(query).all()
            return result