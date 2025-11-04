from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy import String
from server.db.base import Base


class Archetype(Base):
    __tablename__ = "archetypes"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    name: Mapped[str] = mapped_column(String(100), nullable=False)

    def __repr__(self) -> str:
        return f"<Archetype(id={self.id}, name={self.name})>"
