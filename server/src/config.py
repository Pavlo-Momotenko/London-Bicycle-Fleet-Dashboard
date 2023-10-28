class Config:
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    DEBUG = False

    DATABASE = "bicycle_fleet_data"
    DATABASE_USERNAME = "root"
    DATABASE_PASSWORD = "password"
    DATABASE_HOST = "docker_db"

    DATABASE_URL = (
        f"mysql://{DATABASE_USERNAME}:{DATABASE_PASSWORD}@{DATABASE_HOST}/{DATABASE}"
    )

    SQLALCHEMY_DATABASE_URI = DATABASE_URL
