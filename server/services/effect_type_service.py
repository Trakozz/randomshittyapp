from server.repositories.effect_type_repository import EffectTypeRepository


class EffectTypeService:
    def __init__(self, repo: EffectTypeRepository):
        self.repo = repo

    def get_effect_type(self, effect_type_id: int):
        """Get an effect type by ID."""
        return self.repo.get(effect_type_id)

    def list_effect_types(self):
        """List all effect types."""
        return self.repo.list()

    def create_effect_type(self, name: str):
        """Create a new effect type."""
        return self.repo.create(name=name)

    def update_effect_type(self, effect_type_id: int, name: str):
        """Update an effect type."""
        return self.repo.update(effect_type_id, name=name)

    def delete_effect_type(self, effect_type_id: int):
        """Delete an effect type."""
        return self.repo.delete(effect_type_id)
