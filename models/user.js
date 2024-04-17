const { Model, DataTypes } = require('sequelize'); // import sequelize 
const sequelize = require('../config/connection'); // import connection object from connection.js 
const bcrypt = require('bcrypt'); // import bcrypt 
class User extends Model { // User model
  checkPassword(loginPw) { // checkPassword method 
    return bcrypt.compareSync(loginPw, this.password); // compareSync method 
  }
}

User.init(  // User model 
  {
    id: { // id column
      type: DataTypes.INTEGER, // data type 
      allowNull: false, // allow null 
      primaryKey: true, // primary key 
      autoIncrement: true, // auto increment 
    },
    username: { // username column 
      type: DataTypes.STRING, // data type
      allowNull: false, // allow null 
      unique: true, // unique 
    },
    password: { // password column 
      type: DataTypes.TEXT, // data type 
      allowNull: false, // allow null 
      validate: { // password validation 
        len: [8], // password must be at least 8 characters long 
      },
    },
  },
  {
    hooks: { // hooks 
      beforeCreate: async (newUserData) => { // beforeCreate hook 
        newUserData.password = await bcrypt.hash(newUserData.password, 10); // hash password
        return newUserData; // return newUserData 
      },
    },
    sequelize, // for connecting to db with sequelize 
    freezeTableName: true,   // for connecting to db with sequelize 
    underscored: true,
    modelName: 'user',
  }
);

module.exports = User; // export User model (https://sequelize.org/docs/v6/core-concepts/model-basics/) (https://sequelize.org/docs/v6/core-concepts/model-basics/#exporting-models)