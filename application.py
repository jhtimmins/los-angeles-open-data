from flask import Flask
from flask_sqlalchemy import SQLAlchemy
import os

application = Flask(__name__)
application.config.from_pyfile('config.py')
application.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(application)

from models import Appropriation

@application.route('/')
def index():
	return 'welcome home daughter.'

if __name__ == "__main__":
	application.run()
