from logging.config import fileConfig
from pathlib import Path

from sqlalchemy import engine_from_config
from sqlalchemy import pool

from alembic import context

config = context.config

if config.config_file_name is not None:
    fileConfig(config.config_file_name)

# Import app models so Base.metadata is populated for autogenerate
import sys
sys.path.insert(0, str(Path(__file__).resolve().parent.parent))
from app.db import Base
from app.models import *  # noqa: F401,F403
target_metadata = Base.metadata


def run_migrations_offline() -> None:
    from app.core.config import settings
    context.configure(
        url=settings.database_url,
        target_metadata=target_metadata,
        compare_type=True,
        literal_binds=True,
        dialect_opts={"paramstyle": "named"},
    )
    with context.begin_transaction():
        context.run_migrations()


def run_migrations_online() -> None:
    from app.core.config import settings
    config.set_main_option("sqlalchemy.url", settings.database_url)
    connectable = engine_from_config(
        config.get_section(config.config_ini_section, {}),
        prefix="sqlalchemy.",
        poolclass=pool.NullPool,
    )
    with connectable.connect() as connection:
        context.configure(connection=connection, target_metadata=target_metadata)
        with context.begin_transaction():
            context.run_migrations()


if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()
