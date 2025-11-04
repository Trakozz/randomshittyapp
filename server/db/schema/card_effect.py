from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy import ForeignKey
from server.db.base import Base


class CardEffect(Base):
    __tablename__ = "card_effects"

    card_id: Mapped[int] = mapped_column(ForeignKey("cards.id"), primary_key=True)
    effect_id: Mapped[int] = mapped_column(ForeignKey("effects.id"), primary_key=True)

    def __repr__(self) -> str:
        return f"<CardEffect(card_id={self.card_id}, effect_id={self.effect_id})>"
