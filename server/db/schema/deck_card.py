from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy import ForeignKey, Integer, CheckConstraint, DateTime
from server.db.base import Base
from datetime import datetime


class DeckCard(Base):
    __tablename__ = "deck_cards"
    __table_args__ = (
        CheckConstraint('quantity > 0', name='check_quantity_positive'),
    )

    deck_id: Mapped[int] = mapped_column(ForeignKey("decks.id", ondelete="CASCADE"), primary_key=True)
    card_id: Mapped[int] = mapped_column(ForeignKey("cards.id", ondelete="CASCADE"), primary_key=True)
    quantity: Mapped[int] = mapped_column(Integer, nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)

    def __repr__(self) -> str:
        return f"<DeckCard(deck_id={self.deck_id}, card_id={self.card_id}, quantity={self.quantity})>"
