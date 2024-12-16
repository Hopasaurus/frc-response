# FRC Response app from David Hoppe

This application contains the response for the three parts of the FRC Challenge.

Each part contains a readme pertaining to that part:
* [Part 1 Readme](./app/part1/readme.md)
* [Part 2 Readme](./app/part2/readme.md)
* [Part 3 Readme](./app/part3/readme.md)

# Configuring environment variables:

Copy the `env.sample` file to `env` and replace the placeholders with real values for the api keys for OpenWeather API and Stripe.

# Running in a docker container: (preferred)

* From root of repo: `./run.sh`
* Navigate to `http://localhost:3000'`
* Select from the links on top for the response to each part of the challenge.

# Running locally: (ymmv)

* Install nodejs version 20 or higher and npm 10.8.2 or higher
* Change directory to the app: `cd app`
* Install dependencies: `npm ci`
* Run the app with api keys set in the environment: `OPEN_WEATHER_KEY=<open weather key> STRIPE_KEY=<stripe key> npm run live`
