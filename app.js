//Import
const express = require('express');
const { Sequelize } = require('sequelize');
const employeesModel = require('./models/employeesModel.js');
const customersModel = require('./models/customersModel.js');
const foodsModel = require('./models/foodsModel.js');
const ingredientsModel = require('./models/ingredientsModel.js');
//const buyModel = require('./models/buyModel.js');

const config = require('./config/config.json');

//App
const app = express();

/*const employeesRouter = require('./routers/EmployeesRouter.js');
app.use('/employees', employeesRouter);*/

const env = process.env.NODE_ENV || 'development';
const sequelize = new Sequelize(config[env]);


const employee = employeesModel(sequelize);
const customer = customersModel(sequelize);
const food = foodsModel(sequelize);
const ingredient = ingredientsModel(sequelize);
//const buy = buyModel(sequelize);

//Database
sequelize.sync({ force: true })
  .then(() => {
    console.log('Base de données créée avec succès.');

    // Exemple d'insertion d'un employé
    employee.create({
      firstname: 'Hamp',
      lastname: 'Loyé',
      role: 'Manager',
    })
      .then((employee) => {
        console.log('Employé inséré avec succès:', employee.toJSON());
      })
      .catch((error) => {
        console.error('Erreur lors de l\'insertion de l\'employé :', error);
      });
  })
  .catch((error) => {
    console.error('Erreur lors de la création de la base de données :', error);
    process.exit(1);
  });

//Export
module.exports = app;