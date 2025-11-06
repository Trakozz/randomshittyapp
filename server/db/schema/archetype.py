from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy import String, DateTime
from server.db.base import Base
from datetime import datetime


class Archetype(Base):
    __tablename__ = "archetypes"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    name: Mapped[str] = mapped_column(String(100), nullable=False, unique=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)

    def __repr__(self) -> str:
        return f"<Archetype(id={self.id}, name={self.name})>"
