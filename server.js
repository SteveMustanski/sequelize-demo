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
  operatorsAliases: false
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

// define the model for the comment
const Comment = connection.define('Comment', {
  the_comment: Sequelize.STRING
});

// define the model for the post table
const Post = connection.define('Post', {
  title: Sequelize.STRING,
  content: Sequelize.TEXT
});

// define the model for the project table
const Project = connection.define('Project', {
  title: Sequelize.STRING
});

Post.belongsTo(User, { as: 'UserRef', foreignKey: 'userId' });  // puts a foreignKey userid in the post table
Post.hasMany(Comment, {as: 'All_Comments'}); // a foreignKey of PostId will be put in the comment table

// will creat a UserProjects table with the IDs for the ProjectId and UserId
User.belongsToMany(Project, {as: 'Tasks', through: 'UserProjects'});
Project.belongsToMany(User, {as: 'Workers', through: 'UserProjects'});

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

// get a single post
app.get('/singlepost', (req, res) => {
  Post.findById( '1', {
    include: [{
      model: Comment, as: 'All_Comments',
      attributes: ['the_comment']
    }, {
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

// add worker to project
// this route is hardcoded to add user 5 to project 2
app.post('/addWorker', (req, res) => {
  Project.findById(2).then((project) => {
    project.addWorkers(5);
  })
    .then(() => {
      res.send('User add to project');
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
  .then(() => {
    Project.create({
      title: 'project 1'
    }).then((project) => {
      project.setWorkers([4,5]);
    })
  })
  .then(() => {
    Project.create({
      title: 'project2'
    })
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
    Post.create({
      userId: 1,
      title: 'Second post',
      content: 'post content 2'
    })
  })
  .then(() => {
    Post.create({
      userId: 2,
      title: 'First Post',
      content: 'post content 1'
    })
  })
  .then(() => {
    Comment.create({
      PostId: 1,
      the_comment: 'First comment'
    })
  })
  .then(() => {
    Comment.create({
      PostId: 1,
      the_comment: 'Second comment'
    })
  })
  .then(() => {
    console.log('Connection to db successfull');
  });

// start listening on port
app.listen(port, () => {
  console.log(`Running server on port ${port}!`);
})