// const Server = require('./server');
const path = require('path');
const express = require('express');
const cors = require('express-cors');
const bodyParser = require('body-parser')
let bcrypt = require('bcrypt')
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
  user.password = bcrypt.hashSync(request.body.password, 10);
  database('users').insert(user, 'id')
  .then(user => {
    response.status(201).json({id: user[0]})
  })
  .catch(error => {
    console.log('error', error);
    response.sendStatus(500)
  })
})

app.post('/api/v1/signin', (req, res) => {
  database('users').where('email', req.body.email).select()
    .then(user => {
      if (user[0]) {
        if (bcrypt.compareSync(req.body.password, user[0].password))  {
          res.status(200).json(user)
        } else {
          res.json({ message: 'Password Email does not match' })
        }
      } else {
        res.json({ message: 'User not found' })
      }
    })
    .catch(error => {
      console.log('error: ', error);
    })
})



app.get('/api/v1/users', (request, response) => {
  database('users').select()
  .then(users => {
    response.status(200).send(users)
  })
  .catch(error => {
    console.log('error', error);
  })
})

app.get('/api/v1/:user/favorites', (req, res) => {
  const { user } = req.params
  database('favorites').where('user_id', user).select()
  .then(favorites => {
    // let test = JSON.parse(favorites[0].favorite)
    res.status(200).send(favorites)
  })
  .catch(error => {
    console.log('error', error)
    res.send(error)
  })
})

app.get('/api/v1/favorites', (req, res) => {
  database('favorites').select()
  .then(favorites => {
    // let test = JSON.parse(favorites[0].favorite)
    res.status(200).send(favorites)
  })
  .catch(error => {
    console.log('error', error)
    res.send(error)
  })
})

app.post('/api/v1/user/favorites/new', (req, res) => {
  const favorite = req.body
  console.log(favorite)
  database('favorites').insert(favorite, 'id')
  .then(favorites => {
    res.status(200).send(favorites)
  }).catch(error => {
    res.send(error)
  })
})

app.delete('/api/v1/:user/:favoriteID', (req, res) => {
  const { user, favoriteID } = req.params
  database('favorites').where('id', favoriteID ).del()
  .then(favorites => {
    res.status(200).json({message: 'Deleted Favorite Successfully'})
  }).catch(error => {
    res.send(error)
  })
})

app.get('/api/v1/searches', (req, res) => {
  database('searches').select()
  .then(searches => {
    res.status(200).send(searches)
  })
})

app.get('/api/v1/:search', (req, res) => {
  const { search } = req.params
  database('searches').where('search', search)
  .then(results => {
    if (results[0]) {
      res.status(200).send(results)
    } else {
      res.status(404).send('Not found')
    }
  }).catch(error => {
    res.status(404).send(error)
  })
})

app.post('/api/v1/searches/new', (req, res) => {
  const search = req.body
  database('searches').insert(search, 'id')
  .then(response => {
    res.status(200).json({message: 'new search has been added to the database'})
  }).catch(error => {
    res.status(500).json({message: 'already been searched'})
  })
})

app.get('/*', function (req, res) { res.sendFile(path.join(__dirname, '/../index.html')) });



app.listen(port);

console.log(`Listening at http://localhost:${port}`);
