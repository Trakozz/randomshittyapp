from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import String, Integer, ForeignKey, Text
from server.db.base import Base
from typing import List, TYPE_CHECKING

if TYPE_CHECKING:
    from server.db.schema.effect import Effect
    from server.db.schema.bonus import Bonus
    from server.db.schema.deck import Deck


class Card(Base):
    __tablename__ = "cards"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    name: Mapped[str] = mapped_column(String(100), nullable=False)
    archetype_id: Mapped[int] = mapped_column(Integer, ForeignKey("archetypes.id"), nullable=False)
    type_id: Mapped[int] = mapped_column(Integer, ForeignKey("types.id"), nullable=False)
    faction_id: Mapped[int] = mapped_column(Integer, ForeignKey("factions.id"), nullable=False)
    cost: Mapped[int] = mapped_column(Integer, nullable=False)
    combat_power: Mapped[int] = mapped_column(Integer, nullable=False)
    resilience: Mapped[int] = mapped_column(Integer, nullable=False)
    illustration_id: Mapped[int | None] = mapped_column(Integer, ForeignKey("illustrations.id"), nullable=True)
    max_occurrence: Mapped[int] = mapped_column(Integer, nullable=False)
    description: Mapped[str | None] = mapped_column(Text, nullable=True)

    effects: Mapped[List["Effect"]] = relationship(secondary="card_effects", back_populates="cards")
    bonuses: Mapped[List["Bonus"]] = relationship(secondary="card_bonuses", back_populates="cards")
    decks: Mapped[List["Deck"]] = relationship(secondary="deck_cards", back_populates="cards")

    def __repr__(self) -> str:
        return f"Card(id={self.id!r}, name={self.name!r}, archetype_id={self.archetype_id!r}, type_id={self.type_id!r}, faction_id={self.faction_id!r})"
