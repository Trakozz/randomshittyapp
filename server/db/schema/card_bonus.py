from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy import ForeignKey
from server.db.base import Base


class CardBonus(Base):
    __tablename__ = "card_bonuses"

    card_id: Mapped[int] = mapped_column(ForeignKey("cards.id"), primary_key=True)
    bonus_id: Mapped[int] = mapped_column(ForeignKey("bonuses.id"), primary_key=True)

    def __repr__(self) -> str:
        return f"<CardBonus(card_id={self.card_id}, bonus_id={self.bonus_id})>"
