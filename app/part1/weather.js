const https = require('https');

// TODO: handle missing key:
const weatherKey = process.env.OPEN_WEATHER_KEY;
const host = 'api.openweathermap.org';

async function GetWeather(city) {
  // TODO: detect zip code and get location by zip
  //   also parse city look for city/state, and city/state country

  const locations = await getLocationsFromCity(city);
  const locationAndWeathers = await Promise.all(locations.map(getWeatherByLocation));
  return locationAndWeathers.map(cookWeather);
}

async function getLocationsFromCity(city) {
  if (city === 'error') {
    throw new Error(`Error getting location: ${city}`);
  }

  const location = city .split(',')
    .map(x => x.trim())
    .filter(x => typeof x !== 'undefined')
    .map(encodeURIComponent)
    .join(',');
  const limit = 5;
  // TODO: Potentially handle exception here:
  return wrappedGet(`/geo/1.0/direct?q=${location}&limit=${limit}&appid=${weatherKey}`);
}

async function getWeatherByLocation(location) {
  const weather = await wrappedGet(`/data/2.5/weather?lat=${location.lat}&lon=${location.lon}&appid=${weatherKey}`);
  return {location, weather};
}

function cookWeather(locationAndWeather) {
  const rawLocation = locationAndWeather.location;
  return {
    raw: locationAndWeather,
    cooked: {
      temperature: {
        k: locationAndWeather.weather.main.temp,
        c: twoPlaces(k_to_c(locationAndWeather.weather.main.temp)),
        f: twoPlaces(k_to_f(locationAndWeather.weather.main.temp)),
      },
      humidity: locationAndWeather.weather.main.humidity,
      location: [rawLocation.name, rawLocation.state, rawLocation.country].filter(x => typeof x !== 'undefined').join(', '),
    }
  };
}

function getCoordinatesForZip(zip, callback) {
  // TODO: do this later if there is time.
  //http://api.openweathermap.org/geo/1.0/zip?zip=E14,GB&appid={API key}
}

async function wrappedGet(path) {
  const requestOptions = {
    host,
    path,
  };
  return new Promise((resolve, reject) => {
    const req = https.get(requestOptions, function (res) {
      let chunks = [];
      res.setEncoding('utf8');
      res.on('data', (chunk) => {
        chunks.push(chunk);
      });
      res.on('end', () => {
        const body = chunks.join();
        const data = JSON.parse(body);
        resolve(data);
      });
    });

    req.on('error', (err) => {
      console.log('error', err);
      reject(err);
    })
  });
}

function k_to_c(temp) {
  return temp - 273.15;
}

function k_to_f(temp) {
  return k_to_c(temp) * 9/5 + 32;
}

function twoPlaces(input) {
  return (Math.round(input * 100) / 100).toFixed(2)
}

exports.GetWeather = GetWeather;