const router = require('express').Router();
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./employeeApi.json');
const { NotFoundError, InvalidInputError } = require('./errors');

const { EmployeeController  } = require('./employeeController');

router.use('/api-docs', swaggerUi.serve);
router.get('/api-docs', swaggerUi.setup(swaggerDocument));

router.get('/', (req, res) => {
  return res.render('part2index');
});

router.post('/employees', (request, response) => {
  try {
    response.send(EmployeeController.addEmployee(request.body));
  } catch (error) {
    return handleError(error, response);
  }
});

router.get('/employees', (request, response) => {
  response.send(EmployeeController.getEmployees(request.query.name));
});

router.get('/employees/:id', (request, response) => {
  try {
    response.send(EmployeeController.getEmployeeById(request.params.id));
  } catch (error) {
    return handleError(error, response);
  }
});

router.put('/employees/:id', (request, response) => {
  try {
    response.send(EmployeeController.updateEmployee(request.params.id, request.body));
  } catch (error) {
    return handleError(error, response);
  }
});

router.delete('/employees/:id', (request, response) => {
  EmployeeController.deleteEmployee(request.params.id);
  response.status(204).send();
});

function handleError(error, response) {
  if (error instanceof NotFoundError) {
    return response.set('Error', error.message).status(404).send();
  }
  if (error instanceof InvalidInputError) {
    return response.set('Error', error.message).status(400).send();
  }
  return response.set('Error', 'unknown error').status(500).send();
}

module.exports = router;