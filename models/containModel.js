const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define('contain', {
    foodId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
    },
    ingredientId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
    },
  }, {
    tableName: 'contain',
    timestamps: false
  })
};