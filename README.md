markdown
# Todo List API

Projeto de portfólio construído para praticar CRUD completo, autenticação e modelagem de banco relacional, os fundamentos que sustentam qualquer aplicação backend antes de entrar em coisas mais complexas.

Vim do mercado financeiro (assessoria de investimentos, certificação ANBIMA) e estou migrando para dados e tecnologia. Esse projeto não carrega esse lado de negócio, é propositalmente simples: uma API de tarefas com autenticação real, CRUD, filtros e busca, para consolidar backend antes de avançar nos projetos maiores do meu portfólio.

## Stack

- Backend: FastAPI, SQLAlchemy, Alembic
- Autenticação: JWT (python-jose), hash de senha com Passlib/bcrypt
- Banco de dados: PostgreSQL
- Frontend: HTML, CSS e JavaScript puro, sem framework, para não esconder o que acontece nas requisições

## O que a API faz

- Cadastro e login com token JWT
- CRUD de tarefas, cada uma vinculada ao usuário dono (um usuário não acessa tarefa de outro)
- Filtro por status (pendente, em andamento, concluída) e por prioridade (baixa, média, alta)
- Busca por título
- Ordenação por data de criação ou por prazo

## Estrutura

todo-list-api/
├── backend/
│ ├── app/
│ │ ├── main.py # ponto de entrada da API
│ │ ├── core/ # config, segurança (JWT/hash), dependências
│ │ ├── db/ # engine e sessão do banco
│ │ ├── models/ # models SQLAlchemy (User, Task)
│ │ ├── schemas/ # schemas Pydantic
│ │ ├── crud/ # acesso ao banco
│ │ └── routers/ # endpoints (auth, tasks)
│ ├── alembic/ # migrations
│ ├── tests/ # testes com pytest
│ ├── requirements.txt
│ └── .env.example
└── frontend/
├── index.html
├── css/style.css
└── js/ (api.js, auth.js, tasks.js)


## Rodando localmente

### Backend

```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
```

Edite o `.env` com os dados do seu PostgreSQL e uma `SECRET_KEY` própria.

```bash
createdb todolist
alembic upgrade head
uvicorn app.main:app --reload
```

API em `http://localhost:8000`, documentação interativa em `http://localhost:8000/docs`.

### Frontend

```bash
cd frontend
python3 -m http.server 5500
```

Acesse `http://localhost:5500`. Se o backend estiver em outra porta ou host, ajuste `API_BASE_URL` em `frontend/js/api.js`.

## Testes

```bash
cd backend
pytest
```

## Endpoints

| Método | Rota | Descrição | Autenticado |
|--------|------|-----------|-------------|
| POST   | /auth/register | Cria usuário | Não |
| POST   | /auth/login    | Retorna o token JWT | Não |
| GET    | /auth/me       | Dados do usuário logado | Sim |
| POST   | /tasks         | Cria tarefa | Sim |
| GET    | /tasks         | Lista tarefas (filtros e busca) | Sim |
| GET    | /tasks/{id}    | Detalha tarefa | Sim |
| PUT    | /tasks/{id}    | Atualiza tarefa | Sim |
| DELETE | /tasks/{id}    | Remove tarefa | Sim |

Query params de `GET /tasks`: `status_filter`, `priority_filter`, `search`, `order_by` (`created_at` ou `due_date`).

## Deploy

Backend pensado para Render ou Railway, com PostgreSQL gerenciado. Frontend pode ir como site estático no mesmo provedor ou no GitHub Pages, apontando `API_BASE_URL` para a URL pública da API.

## Próximos passos

- Paginação na listagem
- Refresh token
- Testes cobrindo o CRUD de tarefas, hoje só autenticação está coberta

- Paginação na listagem de tarefas
- Refresh token
- Testes cobrindo o CRUD de tarefas, além da autenticação
