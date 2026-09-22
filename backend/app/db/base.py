from sqlalchemy.orm import declarative_base

Base = declarative_base()

# Importa os models aqui para que o Alembic os enxergue no autogenerate.
# Sem isso, `alembic revision --autogenerate` não detecta as tabelas.
from app.models import user  # noqa: E402, F401
from app.models import task  # noqa: E402, F401
