from app import create_app
from app.models import db
from flask_migrate import Migrate
# from server.config import Config

app = create_app()
db.init_app(app)
migrate = Migrate(app, db)
# @app.route("/members")
# def members():
#     return {
#         "members": ["Member 1", "Member 2", "Member 3"]
#     }

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=8000)
