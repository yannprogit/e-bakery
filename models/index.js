const { Sequelize } = require('sequelize');
const config = require('../config/config.json');


const env = process.env.NODE_ENV || 'development';
const sequelize = new Sequelize(config[env]);

module.exports = {
  sequelize,
    customers: require('../models/customersModel.js')(sequelize),
    roles: require('../models/rolesModel.js')(sequelize),
    employees: require('../models/employeesModel.js')(sequelize),
    foods: require('../models/foodsModel.js')(sequelize),
    ingredients: require('../models/ingredientsModel.js')(sequelize),
    buy: require('../models/buyModel.js')(sequelize),
    contain: require('../models/containModel.js')(sequelize)
}

//Define associations between models
//Employee foreign key
sequelize.models.employees.belongsTo(sequelize.models.roles, { foreignKey: 'role' , targetKey: 'id', as: 'employeeRole'});

//Buy foreign keys
sequelize.models.buy.belongsTo(sequelize.models.employees, { foreignKey: 'deliverymanId' , targetKey: 'id', as: 'buyDeliveryman'});
sequelize.models.buy.belongsTo(sequelize.models.customers, { foreignKey: 'customerId' , targetKey: 'id', as: 'buyCustomer'});
sequelize.models.buy.belongsTo(sequelize.models.foods, { foreignKey: 'foodId' , targetKey: 'id', as: 'buyFood'});

//Contain foreign keys
sequelize.models.contain.belongsTo(sequelize.models.foods, { foreignKey: 'foodId' , targetKey: 'id', as: 'containFood'});
sequelize.models.contain.belongsTo(sequelize.models.ingredients, { foreignKey: 'ingredientId' , targetKey: 'id', as: 'containIngredient'});