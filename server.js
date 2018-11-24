const express = require('express');
const Sequelize = require('sequelize');

const app = express();
const port = 8080;

const connection = new Sequelize({
  "username": 'root',
  "password": 'root',
  "host": 'localhost',
  "dialect": 'mysql'
});

connection
.authenticate()
.then(() => {
  console.log('Connection to db successfull');
})


app.listen(port, () => {
  console.log(`Running server on port ${port}!`);
})