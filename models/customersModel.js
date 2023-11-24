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
    },    
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    }, 
  });

    //Add clients
    sequelize.sync().then(() => {
      customer.create({
        firstname: 'Klie',
        lastname: 'Yen',
        mail: 'klie.yen@gmail.com',
        password: 'motdepasse',
      });
    });
  
    return customer;
};