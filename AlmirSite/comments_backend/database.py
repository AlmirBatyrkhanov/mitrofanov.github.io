from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker
from sqlalchemy.orm import declarative_base

POSTGRESQL_URL = (
    "postgresql+asyncpg://admin:admin@localhost:5432/postgres"
)

postgres_engine = create_async_engine(POSTGRESQL_URL, echo=True)
postgres_session_maker = async_sessionmaker(postgres_engine, expire_on_commit=False)

Base = declarative_base()

async def get_db():
    async with postgres_session_maker() as session:
        yield session