"""
Testes de autenticação.

Para rodar: dentro de backend/, com o ambiente virtual ativo e um banco
de testes configurado em DATABASE_URL, execute `pytest`.
"""
import pytest
from fastapi.testclient import TestClient

from app.main import app

client = TestClient(app)


def test_health_check():
    response = client.get("/")
    assert response.status_code == 200
    assert response.json() == {"status": "ok"}


def test_register_and_login():
    register_response = client.post(
        "/auth/register",
        json={
            "username": "usuario_teste",
            "email": "teste@exemplo.com",
            "password": "senha123",
        },
    )
    assert register_response.status_code in (201, 400)
    # 400 acontece se o teste já rodou antes e o usuário já existe.

    login_response = client.post(
        "/auth/login",
        data={"username": "usuario_teste", "password": "senha123"},
    )
    assert login_response.status_code == 200
    assert "access_token" in login_response.json()
