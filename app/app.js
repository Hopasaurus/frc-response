const express = require('express');
const { engine } = require('express-handlebars');

const partOneRoutes = require('./part1/routes');
const partTwoRoutes = require('./part2/routes');
const partThreeRoutes = require('./part3/routes');

const port = process.env.PORT || 3000;
const app = express();

// Configure Handlebars templating engine:
app.set('view engine', '.hbs');
app.engine('.hbs', engine({ extname: '.hbs', }));

// Configure directory for service static files:
app.use(express.static('public'));

// Configure express to use json for serialization and parsing:
app.use(express.json());

app.listen(port, () => {
  console.log(`Server listening on PORT: ${port}`);
});

app.get('/', (req, res) => {
  res.render('main');
});

app.get('/health', (request, response) => {
  response.send({status: "OK"});
});

app.use('/part1', partOneRoutes);
app.use('/part2', partTwoRoutes);
app.use('/part3', partThreeRoutes);
