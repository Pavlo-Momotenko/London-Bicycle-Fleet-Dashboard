class Config:
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    DEBUG = False

    DATABASE = 'bicyclefleetdata'
    DATABASE_USERNAME = 'root'
    DATABASE_PASSWORD = 'password'
    DATABASE_HOST = 'docker_db'

    # SQLALCHEMY_DATABASE_URI = f'mysql://{DATABASE_USERNAME}:{DATABASE_PASSWORD}@{DATABASE_HOST}/{DATABASE}'
    SQLALCHEMY_DATABASE_URI = "mysql://root:password@127.0.0.1:3306/bicyclefleetdata"