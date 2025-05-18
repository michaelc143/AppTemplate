""" Models for the app backend """
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import Column, Integer, ForeignKey, Table
from sqlalchemy.orm import relationship

db = SQLAlchemy()

followers = Table(
    'followers',
    db.metadata,
    Column('follower_id', Integer, ForeignKey('users.id', ondelete='CASCADE')),
    Column('followee_id', Integer, ForeignKey('users.id', ondelete='CASCADE'))
)

class User(db.Model):
    """ User Model """
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(50), unique=True, nullable=False)
    password = db.Column(db.String(255), nullable=False)
    email = db.Column(db.String(255), unique=True, nullable=False)
    created_at = db.Column(db.DateTime, default=db.func.current_timestamp())

    # Define the followers relationship
    followers = relationship(
        'User',
        secondary='followers',
        primaryjoin='User.id == followers.c.followee_id',
        secondaryjoin='User.id == followers.c.follower_id',
        backref='following'
    )

    def __init__(self, username, password, email):
        self.username = username
        self.password = password
        self.email = email
