const bcrypt = require('bcrypt');

'use strict';

module.exports = {
  up: async (queryInterface) => {
    await queryInterface.bulkInsert('employees', [
      {
        firstname: 'Yacowan',
        lastname: 'Keebrady',
        mail: 'yacowan.keebrady@gmail.com',
        password: await bcrypt.hash('mdp', 10),
        role: 1,
        endContract: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ], {});
  },

  down: async (queryInterface) => {
    await queryInterface.bulkDelete('employees', null, {});
  }
};
