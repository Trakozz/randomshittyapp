from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import Text, Integer, ForeignKey
from server.db.base import Base
from typing import List, TYPE_CHECKING

if TYPE_CHECKING:
    from server.db.schema.card import Card


class Bonus(Base):
    __tablename__ = "bonuses"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    description: Mapped[str] = mapped_column(Text, nullable=False)
    archetype_id: Mapped[int] = mapped_column(Integer, ForeignKey("archetypes.id"), nullable=False)

    cards: Mapped[List["Card"]] = relationship(secondary="card_bonuses", back_populates="bonuses")

    def __repr__(self) -> str:
        desc_preview = self.description[:50] + "..." if len(self.description) > 50 else self.description
        return f"<Bonus(id={self.id}, description={desc_preview}, archetype_id={self.archetype_id})>"
