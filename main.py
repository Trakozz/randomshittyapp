from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from server.db.db_config import init_db

app = FastAPI()

# Configure CORS - Allows frontend to communicate with backend
# Including file uploads (multipart/form-data)
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",  # Vite dev server
        "http://127.0.0.1:5173",  # Alternative localhost
    ],
    allow_credentials=True,
    allow_methods=["*"],  # Allows GET, POST, PUT, DELETE, OPTIONS, etc.
    allow_headers=["*"],  # Allows all headers including Content-Type for multipart/form-data
    expose_headers=["*"],  # Expose all response headers to the frontend
)

# Initialize database
init_db()

# Include routers
from server.api.routes.card_routes import router as card_router
from server.api.routes.deck_routes import router as deck_router
from server.api.routes.archetype_routes import router as archetype_router
from server.api.routes.type_routes import router as type_router
from server.api.routes.faction_routes import router as faction_router
from server.api.routes.effect_routes import router as effect_router
from server.api.routes.effect_type_routes import router as effect_type_router
from server.api.routes.bonus_routes import router as bonus_router
from server.api.routes.illustration_routes import router as illustration_router

app.include_router(card_router)
app.include_router(deck_router)
app.include_router(archetype_router)
app.include_router(type_router)
app.include_router(faction_router)
app.include_router(effect_router)
app.include_router(effect_type_router)
app.include_router(bonus_router)
app.include_router(illustration_router)

@app.get("/api/health")
async def health_check():
    return {"status": "ok", "message": "API is running"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
