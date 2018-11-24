const express = require('express');
const Sequelize = require('sequelize');

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
// uuid is a universal unique id, setting default value keeps it from being null
// the 3rd argument sets properties on the modle
// timestamps false set no created or updated fields are created
const User = connection.define('User', {
  uuid: {
    type: Sequelize.UUID,
    primaryKey: true,
    defaultValue: Sequelize.UUIDV4
  },
  name: Sequelize.STRING,
  bio: Sequelize.TEXT,
}, 
{
  timestamps: false
}
);

// connect and sync the database then log success
// logging option shows the sql in the console
// setting force to true will drop the tables and recreate on connection
connection
.sync({
  logging: console.log,
  force: true
})
.then(() => {
  User.create({
    name: 'Sally',
    bio: 'New bio entry for Sally'
  })
})
.then(() => {
  console.log('Connection to db successfull');
});

// start listening on port
app.listen(port, () => {
  console.log(`Running server on port ${port}!`);
})