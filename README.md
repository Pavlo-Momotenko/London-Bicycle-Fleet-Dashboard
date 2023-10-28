# London Bicycle Fleet Dashboard

## Technology stack

1) Back-End part:
    - Python 3.10
    - Flask
    - SQLAlchemy
    - Pandas

2) Front-End part:
   - React
   - React Bootstrap
   - Highcharts

3) Database:
    - MySQL

## Installation
1) `docker-compose up -d`
2) Enjoy!

## Development
### Unit tests
- Run tests - `python -m unittests`

### Code quality checks
- Formatter - `black .`
- Linter - `flake8 --max-line-length 120`
- Annotation - `mypy .`

### Alembic
- Generate migrations - `alembic revision --autogenerate -m "<MESSAGE>"`
- Apply migrations - `alembic upgrade head`

## Project demo
[![Project demo](https://img.youtube.com/vi/1C8aJwPiq5E/maxresdefault.jpg)](https://www.youtube.com/watch?v=1C8aJwPiq5E)
