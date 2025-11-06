from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import String, Integer, ForeignKey, DateTime
from server.db.base import Base
from datetime import datetime
from typing import TYPE_CHECKING, List

if TYPE_CHECKING:
    from server.db.schema.card import Card


class Illustration(Base):
    __tablename__ = "illustrations"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    filename: Mapped[str] = mapped_column(String(255), nullable=False)
    original_name: Mapped[str | None] = mapped_column(String(255), nullable=True)
    archetype_id: Mapped[int] = mapped_column(Integer, ForeignKey("archetypes.id", ondelete="RESTRICT"), nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)
    
    # Back-reference to cards using this illustration
    cards: Mapped[List["Card"]] = relationship(back_populates="illustration", foreign_keys="Card.illustration_id")

    def __repr__(self) -> str:
        return f"<Illustration(id={self.id}, filename={self.filename}, archetype_id={self.archetype_id})>"
