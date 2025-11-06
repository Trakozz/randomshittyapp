from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy import String, DateTime
from server.db.base import Base
from datetime import datetime


class Type(Base):
    __tablename__ = "types"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    name: Mapped[str] = mapped_column(String(100), nullable=False, unique=True)
    icon_path: Mapped[str | None] = mapped_column(String(255), nullable=True)
    color: Mapped[str | None] = mapped_column(String(7), nullable=True)  # Hex color code (e.g., #FF5733)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)

    def __repr__(self) -> str:
        return f"<Type(id={self.id}, name={self.name}, icon_path={self.icon_path}, color={self.color})>"
