from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy import String, Integer, ForeignKey
from server.db.base import Base

class Faction(Base):
    __tablename__ = "factions"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    name: Mapped[str] = mapped_column(String(100), nullable=False)
    archetype_id: Mapped[int] = mapped_column(Integer, ForeignKey("archetypes.id"), nullable=False)

    def __repr__(self) -> str:
        return f"Faction(id={self.id!r}, name={self.name!r}, archetype_id={self.archetype_id!r})"