from app import create_app
from app.models import db
from flask_migrate import Migrate


app = create_app()
db.init_app(app)
migrate = Migrate(app, db)


if __name__ == "__main__":
    app.run(host='0.0.0.0', port=8000)
