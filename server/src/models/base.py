from src.models.db_obj import db


class Base(db.Model):
    __abstract__ = True
    id = db.Column(db.Integer, primary_key=True)

    @classmethod
    def find(cls, **kwargs):
        return cls.query.filter_by(**kwargs).first()

    @classmethod
    def find_or_create(cls, commit=True, **kwargs):
        obj = cls.find(**kwargs)
        if not obj:
            obj = cls.create(commit=commit, **kwargs)
        return obj

    @classmethod
    def get_by_id(cls, obj_id: int):
        return cls.query.get(obj_id)

    @classmethod
    def create(cls, commit=True, **kwargs):
        instance = cls(**kwargs)
        obj = instance.save(commit)
        return obj

    @classmethod
    def delete_all(cls, commit=True):
        cls.query.delete()
        return commit and db.session.commit()

    def update(self, commit=True, **kwargs):
        for attr, value in kwargs.items():
            setattr(self, attr, value)
        return commit and self.save() or self

    def save(self, commit=True):
        db.session.add(self)
        if commit:
            db.session.commit()
        return self

    def delete(self, commit=True):
        db.session.delete(self)
        return commit and db.session.commit()
