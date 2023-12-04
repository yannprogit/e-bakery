const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define('buy', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    dueDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    customerId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    foodId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    deliverymanId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    deliveryDate: {
      type: DataTypes.DATE,
    },
  }, {
    tableName: 'buy',
  })
};