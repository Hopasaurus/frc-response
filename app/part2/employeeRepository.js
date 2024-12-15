const { NotFoundError, InvalidInputError } = require('./errors');

const employees = [
  // A few employee to seed the "database":
  { id: 0, name: 'Phantom', email: 'people get nervous when lists start a zero', position: 'Ghost', active: false },
  { id: 1, name: 'Able', email: 'able@example.com', position: 'Farmer', active: true },
  { id: 2, name: 'Baker', email: 'baker@example.com', position: 'Baker', active: true },
  { id: 3, name: 'Charlie', email: 'charlie@example.com', position: 'Cook', active: true },
];

const EmployeeRepository = {
  create: function(employee) {
    employee['id'] = getNextId();
    employees.push(employee);
    return employee;
  },
  findAll: function(name) {
    console.log('fa: ', name);
    return employees.filter(both(isActive, nameMatches(name))).map(mapToDomain);
  },
  findById: function(id) {
    validateId(id);
    return mapToDomain(employees[id]);
  },
  update: function(id, employee) {
    validateId(id);
    employees[id].name = employee.name;
    employees[id].email = employee.email;
    employees[id].position = employee.position;
    return mapToDomain(employees[id]);
  },
  delete: function(id) {
    if (employees.length >= id) {
      employees[id]['active'] = false;
    }
  }
}

function validateId(id) {
  if (isNaN(Number(id))) {
    throw new InvalidInputError('id must be a number');
  }

  if (employees.length <= id) {
    throw new NotFoundError('employee does not exist');
  }

  if (employees[id].active === false) {
    throw new NotFoundError('employee does not exist');
  }
}

function both(fnA, fnB) {
  return (employee) => {
    return fnA(employee) && fnB(employee);
  }
}

function isActive(employee) {
  return employee['active'] === true;
}

function nameMatches(name) {
  return (employee) => {
    console.log('name', name);

    if (typeof name === 'undefined' || name === null || name === '') {
      return true;

    }
    return employee['name'].toLowerCase().includes(name.toLowerCase());
  }
}

function mapToDomain(input) {
  // active is a private field, don't leak it.
  return {
    id: input.id,
    name: input.name,
    email: input.email,
    position: input.position,
  };
}

function getNextId() {
  return employees.length + 1;
}

exports.EmployeeRepository = EmployeeRepository;