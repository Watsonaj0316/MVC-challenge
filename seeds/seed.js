const sequelize = require('../config/connection'); // Import the connection object from config/connection.js
const { User, Post, Comment } = require('../models'); // Import the User, Post, and Comment models

const userData = require('./userData.json'); // Import the userData.json file
const postData = require('./postData.json'); // Import the postData.json file
const commentData = require('./commentData.json'); // Import the commentData.json file

// seed database function 
const seedDatabase = async () => { // seedDatabase function 
  await sequelize.sync({ force: true }); // sync method 

  await User.bulkCreate(userData, { // bulkCreate method 
    individualHooks: true, // individualHooks method 
    returning: true, // returning method 
  });

  await Post.bulkCreate(postData, { // bulkCreate method 
    individualHooks: true, // individualHooks method 
    returning: true, // returning method 
  });

  await Comment.bulkCreate(commentData, { // bulkCreate method 
    individualHooks: true, // individualHooks method 
    returning: true, // returning method 
  });

  process.exit(0); // exit process 
};

seedDatabase(); // seedDatabase function 