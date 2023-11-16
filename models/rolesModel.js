const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const role = sequelize.define('roles', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
  }, {
    timestamps: false
  });

  return role;
};
