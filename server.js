const express = require('express');
const Sequelize = require('sequelize');
const _USERS = require('./users.json');
const Op = Sequelize.Op;

const app = express();
const port = 8080;


// config options for connecting to the database
// define property sets options for all models
// freezeTableName true does not pluralize the table name
const connection = new Sequelize({
  username: 'root',
  password: 'root',
  database: 'testDB',
  host: 'localhost',
  dialect: 'mysql',
  define: {
    freezeTableName: true,
  }
});

// define the model for the user table

const User = connection.define('User', {
  name: Sequelize.STRING,
  email: {
    type: Sequelize.STRING,
    validate: {
      isEmail: true
    }
  },
  password: {
    type: Sequelize.STRING,
    validate: {
      isAlphanumeric: true
    }
  }
}
);

// find by id
app.get('/findone', (req, res) => {
  User.findById('55')
    .then(user => {
      res.json(user);
    })
    .catch(error => {
      console.log(error);
      res.status(404).send(error);
    })
})

// get all users
// find all users were name like O*
app.get('/findall', (req, res) => {
  User.findAll({
    where: {
      name: {
        [Op.like]: 'O%'
      }
    }
  })
    .then(user => {
      res.json(user);
    })
    .catch(error => {
      console.log(error);
      res.status(404).send(error);
    })
})

// update by id
// sequelize does not return the updated user
//  but only the number of rows updated
app.put('/update', (req, res) => {
  User.update({
    name: 'Michael Keaton',
    password: 'password'
  },
  {where: {id: 55}})
    .then(rows => {
      res.json(rows);
    })
    .catch(error => {
      console.log(error);
      res.status(404).send(error);
    })
})

// routes
// psudo code
app.post('/post', (req, res) => {
  const newUser = req.body.user;
  User.create(newUser)
    .then(user => {
      res.json(user);
    })
    .catch(error => {
      console.log(error);
      res.status(404).send(error);
    })
})


// connect and sync the database then log success
// logging option shows the sql in the console
// setting force to true will drop the tables and recreate on connection
connection
  .sync({
    logging: console.log,
  })
  // commented out since the users have been created
  // this is left in for demo purposes
  // .then(() => {
  //   User.bulkCreate(_USERS)
  //   .then(users => {
  //     console.log('Successfully added users');
  //   })
  //   .catch(error => {
  //     console.log(error);
  //   })
  // })
  .then(() => {
    console.log('Connection to db successfull');
  });

// start listening on port
app.listen(port, () => {
  console.log(`Running server on port ${port}!`);
})