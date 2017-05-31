// const Server = require('./server');
const path = require('path');
const express = require('express');
const cors = require('express-cors');
const bodyParser = require('body-parser')
const port = (process.env.PORT || 3000);
const app = express();
const router = require('./router');
const environment = process.env.NODE_ENV || 'development';
const configuration = require('../knexfile')[environment];
const database = require('knex')(configuration)

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

if (process.env.NODE_ENV !== 'production') {
  const webpack = require('webpack');
  const webpackDevMiddleware = require('webpack-dev-middleware');
  const webpackHotMiddleware = require('webpack-hot-middleware');
  const config = require('../webpack.config.js');
  const compiler = webpack(config);

  app.use(webpackHotMiddleware(compiler));
  app.use(webpackDevMiddleware(compiler, {
    noInfo: true,
    publicPath: config.output.publicPath
  }));
}

app.use('/assets', express.static(path.join(__dirname, '../app/assets')));

app.get('/', function (req, res) { res.sendFile(path.join(__dirname, '/../index.html')) });

app.use('/api/v1', router);

app.post('/api/v1/users/new', (request, response) => {
  console.log(request.body);
  const user = request.body
  database('users').insert(user, 'id')
  .then(user => {
    response.status(201).json({id: user[0]})
  })
  .catch(error => {
    console.log('error', error);
  })
})

app.post('/api/v1/signin', (req, res) => {
  database('users').where('email', req.body.email).andWhere('password', req.body.password).select()
    .then(user => {
      if (user[0]) {
        res.status(200).json(user)
      } else {
        res.json({message: 'Password or Email does not match'})
      }
    })
    .catch(error => {
      console.log('error: ', error);
    })
})


app.get('/api/v1/users', (request, response) => {
  database('users').select()
  .then(users => {
    let test = JSON.stringify(users)
    response.status(200).send(test)
  })
  .catch(error => {
    console.log('error', error);
  })
})

app.get('/*', function (req, res) { res.sendFile(path.join(__dirname, '/../index.html')) });



app.listen(port);

console.log(`Listening at http://localhost:${port}`);
