from flask import Flask
application = Flask(__name__)

@application.route('/')
def index():
	return 'welcome home daughter.'

if __name__ == "__main__":
	application.run()
