'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    
    await queryInterface.bulkDelete('buy', null);
    await queryInterface.bulkDelete('contain', null);
    await queryInterface.bulkDelete('foods', null);
    await queryInterface.bulkDelete('ingredients', null);
    await queryInterface.bulkDelete('customers', null);
    await queryInterface.bulkDelete('employees', {
      id: {
        [Sequelize.Op.not]: 1
      }
    });
  }
};
