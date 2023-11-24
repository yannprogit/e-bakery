const { Sequelize } = require('sequelize');
const config = require('../config/config.json');


const env = process.env.NODE_ENV || 'development';
const sequelize = new Sequelize(config[env]);

module.exports = {
  sequelize,
    customers: require('../models/customersModel.js')(sequelize),
    employees: require('../models/employeesModel.js')(sequelize),
    foods: require('../models/foodsModel.js')(sequelize),
    ingredients: require('../models/ingredientsModel.js')(sequelize),
    buy: require('../models/buyModel.js')(sequelize)
}