# Todo List API

API de lista de tarefas com autenticação de usuário, CRUD completo, filtros, busca e frontend em HTML/CSS/JS puro consumindo a API.

## Stack

- **Backend:** FastAPI, SQLAlchemy, Alembic, JWT (python-jose), hash de senha com Passlib/bcrypt
- **Banco de dados:** PostgreSQL
- **Frontend:** HTML, CSS e JavaScript puro (sem framework)

## Funcionalidades

- Cadastro e login de usuário com token JWT
- CRUD de tarefas, com cada tarefa vinculada ao usuário dono
- Filtro por status (pendente, em andamento, concluída) e prioridade (baixa, média, alta)
- Busca por título
- Ordenação por data de criação ou por prazo

## Estrutura do projeto

```
todo-list-api/
├── backend/
│   ├── app/
│   │   ├── main.py          # ponto de entrada da API
│   │   ├── core/             # config, segurança (JWT/hash), dependências
│   │   ├── db/                # engine e sessão do banco
│   │   ├── models/           # models SQLAlchemy (User, Task)
│   │   ├── schemas/          # schemas Pydantic
│   │   ├── crud/              # funções de acesso ao banco
│   │   └── routers/          # endpoints (auth, tasks)
│   ├── alembic/               # migrations
│   ├── tests/                  # testes com pytest
│   ├── requirements.txt
│   └── .env.example
└── frontend/
    ├── index.html
    ├── css/style.css
    └── js/ (api.js, auth.js, tasks.js)
```

## Como rodar localmente

### 1. Backend

```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
```

Edite o `.env` com os dados do seu banco PostgreSQL e uma `SECRET_KEY` própria.

Crie o banco (exemplo local):

```bash
createdb todolist
```

Rode as migrations:

```bash
alembic upgrade head
```

Suba a API:

```bash
uvicorn app.main:app --reload
```

A API estará em `http://localhost:8000`, com documentação interativa em `http://localhost:8000/docs`.

### 2. Frontend

Abra `frontend/index.html` diretamente no navegador, ou sirva a pasta com qualquer servidor estático:

```bash
cd frontend
python3 -m http.server 5500
```

Acesse `http://localhost:5500`. Se o backend rodar em outra porta/host, ajuste `API_BASE_URL` em `frontend/js/api.js`.

## Testes

```bash
cd backend
pytest
```

## Principais endpoints

| Método | Rota            | Descrição                          | Autenticado |
|--------|-----------------|-------------------------------------|-------------|
| POST   | /auth/register  | Cria um novo usuário                | Não         |
| POST   | /auth/login     | Retorna o token JWT                 | Não         |
| GET    | /auth/me        | Dados do usuário logado             | Sim         |
| POST   | /tasks          | Cria uma tarefa                     | Sim         |
| GET    | /tasks          | Lista tarefas (filtros e busca)     | Sim         |
| GET    | /tasks/{id}     | Detalha uma tarefa                  | Sim         |
| PUT    | /tasks/{id}     | Atualiza uma tarefa                 | Sim         |
| DELETE | /tasks/{id}     | Remove uma tarefa                   | Sim         |

Parâmetros de busca em `GET /tasks`: `status_filter`, `priority_filter`, `search`, `order_by` (`created_at` ou `due_date`).

## Deploy

Sugestão: Render ou Railway para o backend (com um PostgreSQL gerenciado), e o frontend pode ser servido como site estático no mesmo provedor ou no GitHub Pages, apontando `API_BASE_URL` para a URL pública da API.

## Melhorias futuras

- Paginação na listagem de tarefas
- Refresh token
- Testes cobrindo o CRUD de tarefas, além da autenticação
