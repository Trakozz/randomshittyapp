from server.repositories.archetype_repository import ArchetypeRepository

class ArchetypeService:
    def __init__(self, repo: ArchetypeRepository):
        self.repo = repo

    def create_archetype(self, name: str):
        return self.repo.create(name)

    def get_archetype(self, archetype_id: int):
        return self.repo.get(archetype_id)

    def list_archetypes(self):
        return self.repo.list()
    
    def update_archetype(self, archetype_id: int, name: str):
        return self.repo.update(archetype_id, name)
    
    def delete_archetype(self, archetype_id: int):
        return self.repo.delete(archetype_id)
    
    def get_archetype_by_name(self, name: str):
        return self.repo.get_by_name(name)
