from sqlalchemy import create_engine
from db_schema import Base

engine = create_engine("postgresql+psycopg://user:password@localhost/postgres", echo=True)

Base.metadata.create_all(engine)