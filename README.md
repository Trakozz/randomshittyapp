# AscendanceV2

## Development Setup

### Prerequisites

- Python 3.13 or higher
- `uv` package manager ([installation instructions](https://github.com/astral-sh/uv))

### Installation

Install all dependencies and create/update the virtual environment:

```bash
uv sync
```

### Running the Application

Start the FastAPI server in development mode with auto-reload:

```bash
uv run uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

The API will be available at `http://localhost:8000`.

### Dependency Management

To add a new dependency:

1. Add the package to the `dependencies` array in `pyproject.toml`
2. Run `uv sync` to update `uv.lock`

### Database Setup

The project uses PostgreSQL. You can start the database using Podman Compose:

```bash
podman-compose up -d
```

To initialize the database schema and seed with initial data, run:

```bash
uv run python init_db.py
```

This will:
- Create all database tables with the new schema
- Seed the database with the "Universelle" archetype
- Add sample card types, factions, effect types, effects, and bonuses
- Prepare the database for immediate use
