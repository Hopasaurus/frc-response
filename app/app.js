
const express = require('express');
const { engine } = require('express-handlebars');
const weatherRoutes = require('./part1/routes');

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

app.use('/part1', weatherRoutes);
