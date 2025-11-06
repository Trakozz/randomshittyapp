from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy import ForeignKey, DateTime
from server.db.base import Base
from datetime import datetime


class CardEffect(Base):
    __tablename__ = "card_effects"

    card_id: Mapped[int] = mapped_column(ForeignKey("cards.id", ondelete="CASCADE"), primary_key=True)
    effect_id: Mapped[int] = mapped_column(ForeignKey("effects.id", ondelete="CASCADE"), primary_key=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, nullable=False)

    def __repr__(self) -> str:
        return f"<CardEffect(card_id={self.card_id}, effect_id={self.effect_id})>"
