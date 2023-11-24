const { DataTypes } = require('sequelize');
/*const employee = require('./models/employeesModel.js');
const customer = require('./models/customersModel.js');
const food = require('./models/foodsModel.js');*/

module.exports = (sequelize) => {
  const buy = sequelize.define('Buy', {
    date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  });

/*  buy.belongsTo(customer, { foreignKey: 'customerId', allowNull: false });
  buy.belongsTo(employee, { foreignKey: 'employeeId', allowNull: false });
  buy.belongsTo(food, { foreignKey: 'foodId', allowNull: false });*/

  return buy;
};