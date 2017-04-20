from flask import Flask
from flask import redirect
from flask import render_template
from flask import request
from flask_sqlalchemy import SQLAlchemy
import json
import time

application = Flask(__name__)
application.config.from_pyfile('config.py')
application.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(application)

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
	years = ['2014', '2015', '2016', '2017', '2018']
	appropriations = {
		'2014': {'date': '2014'},
		'2015': {'date': '2015'},
		'2016': {'date': '2016'},
		'2017': {'date': '2017'},
		'2018': {'date': '2018'},
	}

	for program_name, program in department['programs'].iteritems():
		 for year in years:
		 	if program_name not in appropriations[year]:
		 		program_names.add(program_name)
		 		appropriations[year][program_name] = 0
		 for year, amount in program['years'].iteritems():
		 	appropriations[year][program_name] += int(amount)

	return {
			'program_names': list(program_names),
			'years': sorted(years),
			'appropriations': appropriations,
			'max_appropriated': get_max_appropriated(appropriations)
		}

def has_time_threshold_passed():
	threshold_unix_time = 1492718400 + 1800# 1pm pacific time 2017/4/20
	return time.time() >= threshold_unix_time


@application.route("/")
def home():
	appropriations = get_appropriations() 
	department_names = sorted(appropriations.keys())

	if has_time_threshold_passed():
		return render_template(
			'home.html',
			department_names = department_names
		)
	else:
		return render_template(
			'countdown.html'
		)

@application.route('/departments', methods=['GET'])
def breakdown():
	appropriations = get_appropriations() 
	department_names = sorted(appropriations.keys())

	if has_time_threshold_passed():
		return render_template(
			'department.html',
			department_names = department_names
		)
	else:
		return render_template(
			'countdown.html'
		)

@application.route('/department', methods=['POST'])
def department_data():
	appropriations = get_appropriations() 
	department_names = sorted(appropriations.keys())

	name = request.values.get('name', None)
	department = appropriations.get(name, None)
	if not department:
		name = 'Aging'
		department = appropriations.get(name)

	department_data = {
		'department_names': department_names,
		'department': department,
		'department_name': name,
		'appropriations': format_approprations_for_graph(department)
	}

	if has_time_threshold_passed():
		return json.dumps(department_data)
	else:
		return render_template(
			'countdown.html'
		)
	

@application.route('/mayor', methods=['GET'])
def mayor():
	if has_time_threshold_passed():
		return render_template('mayor.html')
	else:
		return render_template('countdown.html')

@application.route("/<path:dummy>")
def catch_all(dummy):
	if has_time_threshold_passed():
		return redirect("/")
	else:
		return render_template('countdown.html')

if __name__ == "__main__":
	application.run()
