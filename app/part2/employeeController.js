const validator = require('email-validator');
const { EmployeeRepository } = require('./employeeRepository');
const { InvalidInputError } = require('./errors');

const EmployeeController = {
  addEmployee: function(employee) {
    validateEmployee(employee);
    return EmployeeRepository.create(employee);
  },
  getEmployees: function(name) {
    return EmployeeRepository.findAll(name);
  },
  getEmployeeById: function(id) {
    return EmployeeRepository.findById(id);
  },
  updateEmployee: function(id, employee) {
    validateEmployee(employee);
    return EmployeeRepository.update(id, employee);
  },
  deleteEmployee: function(id) {
    return EmployeeRepository.delete(id);
  }
};

function validateEmployee(employee) {
  if (!validator.validate(employee.email)) {
    throw new InvalidInputError('email must be a valid email');
  }

  if (typeof employee.name === 'undefined' || employee.name === null || employee.name === '') {
    throw new InvalidInputError('name must not be empty');
  }

  if (typeof employee.position === 'undefined' || employee.position === null || employee.position === '') {
    throw new InvalidInputError('position must not be empty');
  }
}

exports.EmployeeController = EmployeeController;