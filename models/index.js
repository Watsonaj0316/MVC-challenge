const User = require('./user'); // import User model 
const Post = require('./post'); // import Post model 
const Comment = require('./comment'); // import Comment model 

User.hasMany(Post, { // User has many Posts 
  foreignKey: 'username', // foreign key for username 
});

Post.belongsTo(User, { // Post belongs to User 
  foreignKey: 'username', // foreign key for username 
});

Comment.belongsTo(User, { // Comment belongs to User 
  foreignKey: 'username', // foreign key for username 
});

Post.hasMany(Comment, { // Post has many Comments 
  foreignKey: 'post_id', // foreign key for post id 
});

module.exports = { User, Post, Comment }; // export User, Post, and Comment models (https://sequelize.org/docs/v6/core-concepts/model-basics/)