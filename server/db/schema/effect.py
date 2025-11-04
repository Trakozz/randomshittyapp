from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import Text, String, Integer, ForeignKey
from server.db.base import Base
from typing import List, TYPE_CHECKING

if TYPE_CHECKING:
    from server.db.schema.card import Card


class Effect(Base):
    __tablename__ = "effects"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    name: Mapped[str] = mapped_column(String(100), nullable=False)
    description: Mapped[str] = mapped_column(Text, nullable=False)
    archetype_id: Mapped[int] = mapped_column(Integer, ForeignKey("archetypes.id"), nullable=False)
    effect_type_id: Mapped[int | None] = mapped_column(Integer, ForeignKey("effect_types.id"), nullable=True)

    cards: Mapped[List["Card"]] = relationship(secondary="card_effects", back_populates="effects")

    def __repr__(self) -> str:
        return f"<Effect(id={self.id}, name={self.name}, archetype_id={self.archetype_id})>"
