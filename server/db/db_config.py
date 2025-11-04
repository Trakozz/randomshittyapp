from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from server.db.base import Base

# PostgreSQL connection string
DATABASE_URL = "postgresql+psycopg://user:password@localhost/ascendance_db"

# Create the engine
engine = create_engine(
    DATABASE_URL,
    echo=True,          # Log SQL to console (good for dev)
    future=True,        # Use SQLAlchemy 2.0 style
    pool_pre_ping=True, # Detect dropped connections
)

# Session factory — you’ll use this everywhere in your repositories
SessionLocal = sessionmaker(
    bind=engine,
    autoflush=False,
    autocommit=False,
    expire_on_commit=False,
)

def init_db():
    """Create all database tables."""
    # Import all models to register them with Base.metadata
    import server.db.schema
    Base.metadata.create_all(bind=engine)
