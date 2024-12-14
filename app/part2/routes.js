const router = require('express').Router();
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./employeeApi.json');

router.use('/api-docs', swaggerUi.serve);
router.get('/api-docs', swaggerUi.setup(swaggerDocument));

router.get('/', (req, res) => {
  return res.render('part2index');
});

module.exports = router;
