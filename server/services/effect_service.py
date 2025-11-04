from server.repositories.effect_repository import EffectRepository
from typing import Optional

class EffectService:
    def __init__(self, repo: EffectRepository):
        self.repo = repo

    def create_effect(self, name: str, description: str, archetype_id: int, effect_type_id: Optional[int] = None):
        return self.repo.create(name, description, archetype_id, effect_type_id)

    def get_effect(self, effect_id: int):
        return self.repo.get(effect_id)

    def list_effects(self, archetype_id: Optional[int] = None):
        return self.repo.list(archetype_id)
    
    def update_effect(self, effect_id: int, name: str, description: str, archetype_id: int, effect_type_id: Optional[int] = None):
        return self.repo.update(effect_id, name, description, archetype_id, effect_type_id)
    
    def delete_effect(self, effect_id: int):
        return self.repo.delete(effect_id)
