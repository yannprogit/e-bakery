//------------------------ Import ------------------------
const app = require('./app');
const db = require('./models/index.js');
const bcrypt = require('bcrypt');

//------------------------ init port ------------------------
const port = 8000;

//------------------------ Connected database ------------------------
db.sequelize.sync({force: false}).then(async () => {
  console.log('Database connected and synchronized');

  const roles = await db.roles.findAll();
  if (roles.length == 0) {
    await require('./seeders/20231222021145-roles-seed').up(db.sequelize.getQueryInterface());
  }

  const admin = await db.employees.findOne({
    where: {
        id: 1
    }
  });
  if (!admin) {
    await require('./seeders/20231222022250-admin-seed').up(db.sequelize.getQueryInterface());
  }
  
  app.listen(port, () => {
    console.log('Server is running on http://localhost:' + port);
  });
}).catch((e) => {
  console.error(e);
});