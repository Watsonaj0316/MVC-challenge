const { Model, DataTypes } = require('sequelize'); // import sequelize 
const sequelize = require('../config/connection'); // import connection object from connection.js 

class Post extends Model { } // Post model 

Post.init(  // Post model 
  {
    id: { // Post model 
      type: DataTypes.INTEGER, // data type 
      allowNull: false, // allow null 
      autoIncrement: true, // auto increment 
    },
    title: { // title column (
      type: DataTypes.STRING, // data type 
      allowNull: false, // allow null
    },
    content: { // content column 
      type: DataTypes.STRING, // data type 
      allowNull: false, // allow null 
    },
    creator: {  // foreign key for username 
      type: DataTypes.STRING, // data type 
      references: { // references 
        model: 'user', // model 
        key: 'username', // key 
      }
    },
    date_created: { // date created column 
      type: DataTypes.DATE, // data type 
      allowNull: false, // allow null 
      defaultValue: DataTypes.NOW, // records date/time at time of post creation
    },
  },
  {
    sequelize, // for connecting to db with sequelize 
    freezeTableName: true, // for connecting to db with sequelize 
    underscored: true, // 
    modelName: 'post', // for connecting with sequelize 
  }
);

module.exports = Post; // export Post model 