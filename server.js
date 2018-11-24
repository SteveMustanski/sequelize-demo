const express = require('express');
const Sequelize = require('sequelize');

const app = express();
const port = 8080;


app.listen(port, () => {
  console.log(`Running server on port ${port}!`);
})