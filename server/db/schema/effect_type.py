from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy import String
from server.db.base import Base


class EffectType(Base):
    __tablename__ = "effect_types"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    name: Mapped[str] = mapped_column(String(100), nullable=False, unique=True)

    def __repr__(self) -> str:
        return f"<EffectType(id={self.id}, name={self.name})>"
