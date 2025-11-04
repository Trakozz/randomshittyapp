from server.repositories.faction_repository import FactionRepository
from typing import Optional

class FactionService:
    def __init__(self, repo: FactionRepository):
        self.repo = repo

    def create_faction(self, name: str, archetype_id: int):
        return self.repo.create(name, archetype_id)

    def get_faction(self, faction_id: int):
        return self.repo.get(faction_id)

    def list_factions(self, archetype_id: Optional[int] = None):
        return self.repo.list(archetype_id)
    
    def update_faction(self, faction_id: int, name: str, archetype_id: int):
        return self.repo.update(faction_id, name, archetype_id)
    
    def delete_faction(self, faction_id: int):
        return self.repo.delete(faction_id)
