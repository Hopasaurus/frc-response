const router = require('express').Router();

const {GetWeather} = require("./weather");
router.get('/', async (request, response) => {
  const { city } = request.query;

  if (city) {
    try {
      const weathers = await GetWeather(city);
      return response.render('weather', { city, weathers, json: JSON.stringify(weathers, null, 2) });

    } catch (error) {
      console.error(error);
      return response.render('weather', { error });
    }
  }
  response.render('weather');
});

module.exports = router;