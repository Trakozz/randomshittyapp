from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy import String, Integer, ForeignKey
from server.db.base import Base


class Illustration(Base):
    __tablename__ = "illustrations"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    filename: Mapped[str] = mapped_column(String(500), nullable=False)
    original_name: Mapped[str | None] = mapped_column(String(500), nullable=True)
    archetype_id: Mapped[int] = mapped_column(Integer, ForeignKey("archetypes.id"), nullable=False)

    def __repr__(self) -> str:
        return f"<Illustration(id={self.id}, filename={self.filename}, archetype_id={self.archetype_id})>"
