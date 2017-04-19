import csv
import json

def import_dept_descriptions():
	departments = {}
	with open('dept_descriptions.csv', 'rb') as csvfile:
		dept_reader = csv.reader(csvfile, csv.QUOTE_MINIMAL, delimiter = ',')
		next(dept_reader, None)
		for row in dept_reader:
			dept = {
				'number': row[0],
				'name': row[1]
			}

			if len(row) >= 2:
				dept['description'] = row[2]
			else:
				dept['description'] = None

			departments[dept['name']] = dept

	return departments

def import_program_descriptions():
	programs = {}
	with open('program_descriptions.csv', 'rb') as csvfile:
		prog_reader = csv.reader(csvfile, csv.QUOTE_MINIMAL, delimiter = ',')
		next(prog_reader, None)
		for row in prog_reader:
			prog = {
				'number': row[0],
				'name': row[1]
			}

			if len(row) >= 2:
				prog['description'] = row[2]
			else:
				prog['description'] = None

			programs[prog['name']] = prog

	return programs

def import_appropriations():

	department_descriptions = import_dept_descriptions()
	program_descriptions = import_program_descriptions()

	departments = {}
	with open('appropriations.csv', 'rb') as csvfile:
		budget_reader = csv.reader(csvfile, csv.QUOTE_MINIMAL, delimiter = ',')
		next(budget_reader, None)
		for row in budget_reader:
			department_number = row[0]
			department_name = row[1]
			year = row[12]

			if year <= 2013:
				continue
			if not department_number.isdigit():
				continue
			if department_name not in department_descriptions:
				continue

			if department_name not in departments:
				departments[department_name] = {
					'number': department_number,
					'description': department_descriptions[department_name]['description'],
					'programs': {}
				}
			
			program_name = row[5]
			if program_name not in departments[department_name]['programs']:
				if program_name in program_descriptions:
					desc = program_descriptions[program_name]['description']
				else:
					desc = ''

				departments[department_name]['programs'][program_name] = {
					'number': row[4],
					'description': desc,
					'years': {}
				}

			amount = row[11]
			if year not in departments[department_name]['programs'][program_name]['years']:
				departments[department_name]['programs'][program_name]['years'][year] = 0
			
			departments[department_name]['programs'][program_name]['years'][year] += int(float(amount))

	return departments

def save_appropriations(appropriations):
	with open('appropriations.txt', 'w') as outfile:
		json.dump(appropriations, outfile)

save_appropriations(import_appropriations())
