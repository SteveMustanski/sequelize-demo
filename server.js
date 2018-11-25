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

// models

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

// define the model for the post table
const Post = connection.define('Post', {
  id: {
    primaryKey: true,
    type: Sequelize.UUID,
    defaultValue: Sequelize.UUIDV4
  },
  title: Sequelize.STRING,
  content: Sequelize.TEXT
});

Post.belongsTo(User, { as: 'UserRef', foreignKey: 'userId' });  // puts a foreignKey userid in the post table


// routes

// get all users
app.get('/allusers', (req, res) => {
  User.findAll()
    .then(user => {
      res.json(user);
    })
    .catch(error => {
      console.log(error);
      res.status(404).send(error);
    })
})

// get all posts
app.get('/allposts', (req, res) => {
  Post.findAll({
    include: [{
      model: User, as: 'UserRef'
    }]
  })
    .then(post => {
      res.json(post);
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
    force: true,
  })
  // commented out if the users have been created
  // this is left in for demo purposes
  .then(() => {
    User.bulkCreate(_USERS)
      .then(users => {
        console.log('Successfully added users');
      })
      .catch(error => {
        console.log(error);
      })
  })
  .then(() => {
    Post.create({
      userId: 1,
      title: 'First Post',
      content: 'post content 1'
    })
  })
  .then(() => {
    console.log('Connection to db successfull');
  });

// start listening on port
app.listen(port, () => {
  console.log(`Running server on port ${port}!`);
})