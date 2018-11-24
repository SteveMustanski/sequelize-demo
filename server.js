const express = require('express');
const Sequelize = require('sequelize');

const app = express();
const port = 8080;


// config options for connecting to the database
const connection = new Sequelize({
  "username": 'root',
  "password": 'root',
  "database": 'testDB',
  "host": 'localhost',
  "dialect": 'mysql'
});

// define the model for the user table
const User = connection.define('User', {
  name: Sequelize.STRING,
  bio: Sequelize.TEXT
});

// connect and sync the database then log success
// logging option shows the sql in the console
connection
.sync({
  logging: console.log
})
.then(() => {
  console.log('Connection to db successfull');
});

// start listening on port
app.listen(port, () => {
  console.log(`Running server on port ${port}!`);
})