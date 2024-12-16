const router = require('express').Router();
const { StripeController } = require('./stripeController');

router.get('/', async (request, response) => {
  try {
    const charges = await StripeController.getChargeSummary();
    return response.render('charges', { json: JSON.stringify(charges, null, 2) });
  } catch (error) {
    console.error(error);
    return response.render('charges', { error });
  }
});

router.get('/json', async (request, response) => {
  try {
    const charges = await StripeController.getChargeSummary();
    return response.send(charges);
  } catch (error) {
    console.error(error);
    return response.render('charges', { error });
  }
});

module.exports = router;