# Part 1 - Consume Open Weather API
## Scenario:
Your team is developing a dashboard that displays the current weather for a city. Use the OpenWeather API to fetch the current weather for a user-specified city.

## Task:
Write a script or application that accepts a city name as input. Query the OpenWeather API for the current weather information (temperature, humidity, and a brief weather description). Format the data into a readable JSON response to be displayed on the console or in a simple UI.

## Considerations:
Include error handling for invalid city names or network issues. Use an API key securely (environment variables are preferred).


## Notes:
* I hope I used the right OpenWeather API:
  * Documentation for the API I used: 
    * https://openweathermap.org/api/geocoding-api
    * https://openweathermap.org/current
* There is a little bit of validation around the city but more validation would need to be discussed with the users of the product and added as scenarios arise.
* If the product is to be used primarily for a single country the country code could be hard coded.