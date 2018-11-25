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

// routes

// get all users
app.get('/findall', (req, res) => {
  User.findAll()
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