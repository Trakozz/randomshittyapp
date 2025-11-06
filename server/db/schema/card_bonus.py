from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy import ForeignKey, DateTime
from server.db.base import Base
from datetime import datetime


class CardBonus(Base):
    __tablename__ = "card_bonuses"

    card_id: Mapped[int] = mapped_column(ForeignKey("cards.id", ondelete="CASCADE"), primary_key=True)
    bonus_id: Mapped[int] = mapped_column(ForeignKey("bonuses.id", ondelete="CASCADE"), primary_key=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, nullable=False)

    def __repr__(self) -> str:
        return f"<CardBonus(card_id={self.card_id}, bonus_id={self.bonus_id})>"
