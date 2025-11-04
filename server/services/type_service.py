from server.repositories.type_repository import TypeRepository

class TypeService:
    def __init__(self, repo: TypeRepository):
        self.repo = repo

    def create_type(self, name: str):
        return self.repo.create(name)

    def get_type(self, type_id: int):
        return self.repo.get(type_id)

    def list_types(self):
        return self.repo.list()
    
    def update_type(self, type_id: int, name: str):
        return self.repo.update(type_id, name)
    
    def delete_type(self, type_id: int):
        return self.repo.delete(type_id)
