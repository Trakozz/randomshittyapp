from server.repositories.type_repository import TypeRepository
from typing import Optional

class TypeService:
    def __init__(self, repo: TypeRepository):
        self.repo = repo

    def create_type(self, name: str, icon_path: Optional[str] = None, color: Optional[str] = None):
        return self.repo.create(name, icon_path, color)

    def get_type(self, type_id: int):
        return self.repo.get(type_id)

    def list_types(self):
        return self.repo.list()
    
    def update_type(self, type_id: int, name: Optional[str] = None, icon_path: Optional[str] = None, color: Optional[str] = None):
        return self.repo.update(type_id, name, icon_path, color)
    
    def delete_type(self, type_id: int):
        return self.repo.delete(type_id)
