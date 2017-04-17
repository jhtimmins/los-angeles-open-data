from app import db

class Appropriation(db.Model):
    __tablename__ = 'appropriation'

    id = db.Column(db.Integer, primary_key=True)
    department_code = db.Column(db.Integer)
    department_name = db.Column(db.String())
    subdepartment_code = db.Column(db.String())
    subdepartment_name = db.Column(db.String())
    program_code = db.Column(db.Integer)
    program_name = db.Column(db.String())
    program_priority = db.Column(db.String())
    source_fund_code = db.Column(db.String())
    source_fund_name = db.Column(db.String())
    account_code = db.Column(db.String())
    account_name = db.Column(db.String())
    appropriation = db.Column(db.Float)
    fiscal_year = db.Column(db.Integer)
    expense_type = db.Column(db.String())

    def __init__(self, property_data):
        self.department_code = property_data['department_code'] or None
        self.department_name = property_data['department_name'] or None
        self.subdepartment_code = property_data['subdepartment_code'] or None
        self.subdepartment_name = property_data['subdepartment_name'] or None
        self.program_code = property_data['program_code'] or None
        self.program_name = property_data['program_name'] or None
        self.program_priority = property_data['program_priority'] or None
        self.source_fund_code = property_data['source_fund_code'] or None
        self.source_fund_name = property_data['source_fund_name'] or None
        self.account_code = property_data['account_code'] or None
        self.account_name = property_data['account_name'] or None
        self.appropriation = property_data['appropriation'] or None
        self.fiscal_year = property_data['fiscal_year'] or None
        self.expense_type = property_data['expense_type'] or None

    def __repr__(self):
        return '<id {}>'.format(self.id)