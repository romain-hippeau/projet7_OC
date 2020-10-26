/* CONNEXION DB */
const { Sequelize } = require('sequelize');// on récupère sequelize
require('dotenv').config() // On récupère les variables d'environnement

const sequelize = new Sequelize('database_development', process.env.DB_USER_NAME, process.env.DB_USER_PWD,{ // 'database', 'username', 'password'
	host: 'localhost',
	dialect: 'mysql'
});
//console.log(sequelize); // VERIFICATION RECUPERATION SEQUELIZE POUR TEST
//console.log(process.env); // LISTES VARIABLES ENVIRONNEMENT POUR TEST

sequelize.authenticate()
  .then(() => console.log('Connection has been established successfully.'))
  .catch((err) => console.log('Unable to connect to the database:', err));


  module.exports= sequelize;