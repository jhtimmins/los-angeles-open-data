from flask import Flask
from flask import render_template
from flask import request
from flask_sqlalchemy import SQLAlchemy
import json

application = Flask(__name__)
application.config.from_pyfile('config.py')
application.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(application)

from models import Appropriation

def get_appropriations():
	with open("data/appropriations.txt") as data_file:
		return json.load(data_file)

def get_max_appropriated(appropriations):
	maximum = 0
	for year, apps in appropriations.iteritems():
		total = 0
		for app, amount in apps.iteritems():
			total += int(amount)
		if total > maximum: 
			maximum = total

	return maximum

def format_approprations_for_graph(department):
	program_names = set()
	years = []
	appropriations = {}

	for program_name, program in department['programs'].iteritems():
		# print program
		 for year, amount in program['years'].iteritems():
		 	if year not in years:
		 		years.append(year)
		 		appropriations[year] = {'date': year}
		 	if program_name not in appropriations[year]:
		 		program_names.add(program_name)
		 		appropriations[year][program_name] = 0
		 	appropriations[year][program_name] += int(amount)

	return {
			'program_names': list(program_names),
			'years': sorted(years),
			'appropriations': appropriations,
			'max_appropriated': get_max_appropriated(appropriations)
		}


@application.route('/')
def index():
	appropriations = get_appropriations() 
	department_names = sorted(appropriations.keys())

	return render_template(
		'index.html',
		department_names = department_names
		)

@application.route('/departments', methods=['GET'])
def breakdown():
	appropriations = get_appropriations() 
	department_names = sorted(appropriations.keys())

	return render_template(
		'index.html',
		department_names = department_names
		)

@application.route('/department', methods=['POST'])
def department_data():
	appropriations = get_appropriations() 
	department_names = sorted(appropriations.keys())

	name = request.values.get('name', None)
	department = appropriations.get(name, None)
	if not department:
		department = appropriations.get('Aging')

	department_data = {
		'department_names': department_names,
		'department': department,
		'appropriations': format_approprations_for_graph(department)
	}

	return json.dumps(department_data)

if __name__ == "__main__":
	application.run()
