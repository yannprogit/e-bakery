'use strict';

module.exports = {
  up: async (queryInterface) => {
    await queryInterface.bulkInsert('roles', [
      { id: 1, name: 'admin' },
      { id: 2, name: 'deliveryman' },
      { id: 3, name: 'baker' },
      { id: 4, name: 'cashier' },
      { id: 5, name: 'manager' },
    ], {});
  },

  down: async (queryInterface) => {
    await queryInterface.bulkDelete('roles', null, {});
  }
};
