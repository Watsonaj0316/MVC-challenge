const Sequelize = require('sequelize'); // import sequelize 
require('dotenv').config(); // import dotenv

let sequelize; // sequelize object

if (process.env.JAWSDB_URL) { // if JAWSDB_URL is defined  
  sequelize = new Sequelize(process.env.JAWSDB_URL); // use JAWSDB_URL 
} else { // if JAWSDB_URL is not defined 
  sequelize = new Sequelize( // use local database 
    process.env.DB_NAME, // database name 
    process.env.DB_USER, // database user 
    process.env.DB_PASSWORD, // database password 
    {
      host: 'localhost', // database host
      dialect: 'mysql', // database dialect 
      port: 3306 // database port 
    }
  );
}

module.exports = sequelize; // export sequelize object 