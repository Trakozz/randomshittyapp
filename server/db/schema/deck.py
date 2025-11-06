from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import String, Text, Integer, ForeignKey, DateTime
from server.db.base import Base
from datetime import datetime
from typing import List, TYPE_CHECKING

if TYPE_CHECKING:
    from server.db.schema.card import Card
    from server.db.schema.archetype import Archetype


class Deck(Base):
    __tablename__ = "decks"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    name: Mapped[str] = mapped_column(String(100), nullable=False)
    description: Mapped[str | None] = mapped_column(Text, nullable=True)
    archetype_id: Mapped[int] = mapped_column(Integer, ForeignKey("archetypes.id", ondelete="RESTRICT"), nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)

    # Many-to-many relationship
    cards: Mapped[List["Card"]] = relationship(secondary="deck_cards", back_populates="decks")
    
    # Many-to-one relationship
    archetype: Mapped["Archetype"] = relationship(foreign_keys=[archetype_id])

    def __repr__(self) -> str:
        return f"<Deck(id={self.id}, name={self.name}, archetype_id={self.archetype_id})>"
