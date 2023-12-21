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
    },
    customerId: {
      type: DataTypes.INTEGER,
    },
    foodId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    deliverymanId: {
      type: DataTypes.INTEGER,
    },
    deliveryDate: {
      type: DataTypes.DATE,
    },
    status: {
      type: DataTypes.ENUM('cart', 'paid'),
      allowNull: false,
      defaultValue: 'cart',
    },
    validation: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    qty: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  }, {
    tableName: 'buy',
  })
};