'use strict';
const db = require('../models/index.js');

module.exports = {
  up: async () => {
    await db.sequelize.drop();
    await db.sequelize.sync({ force: true });

    await require('../seeders/20231222021145-roles-seed').up(db.sequelize.getQueryInterface());
    await require('../seeders/20231222022250-admin-seed').up(db.sequelize.getQueryInterface());
  }
};
