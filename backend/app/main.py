from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routers import auth, tasks

app = FastAPI(
    title="Todo List API",
    description="API de lista de tarefas com autenticação JWT, CRUD, filtros e busca.",
    version="1.0.0",
)

# Libera acesso do frontend estático (arquivo local ou outro host).
# Em produção, restrinja allow_origins ao domínio real do frontend.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(tasks.router)


@app.get("/")
def health_check():
    return {"status": "ok"}
