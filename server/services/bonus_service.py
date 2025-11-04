from server.repositories.bonus_repository import BonusRepository
from typing import Optional

class BonusService:
    def __init__(self, repo: BonusRepository):
        self.repo = repo

    def create_bonus(self, description: str, archetype_id: int):
        return self.repo.create(description, archetype_id)

    def get_bonus(self, bonus_id: int):
        return self.repo.get(bonus_id)

    def list_bonuses(self, archetype_id: Optional[int] = None):
        return self.repo.list(archetype_id)
    
    def update_bonus(self, bonus_id: int, description: str, archetype_id: int):
        return self.repo.update(bonus_id, description, archetype_id)
    
    def delete_bonus(self, bonus_id: int):
        return self.repo.delete(bonus_id)
