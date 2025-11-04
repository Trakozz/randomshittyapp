from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy import String
from server.db.base import Base


class Type(Base):
    __tablename__ = "types"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    name: Mapped[str] = mapped_column(String(100), nullable=False)

    def __repr__(self) -> str:
        return f"<Type(id={self.id}, name={self.name})>"
