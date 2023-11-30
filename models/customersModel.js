const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const customer = sequelize.define('customers', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    firstname: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    lastname: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    mail: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },    
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    }, 
  });
  
    return customer;
};