//------------------------ Import ------------------------
const app = require('./app');
const db = require('./models/index.js');
const bcrypt = require('bcrypt');

//------------------------ init port ------------------------
const port = 8000;

//------------------------ Connected database ------------------------
db.sequelize.sync({force: true}).then(async () => {
  console.log('Database connected and synchronized');

  await require('./seeders/20231222021145-roles-seed').up(db.sequelize.getQueryInterface());
  await require('./seeders/20231222022250-admin-seed').up(db.sequelize.getQueryInterface());

  app.listen(port, () => {
    console.log('Server is running on http://localhost:' + port);
  });
}).catch((e) => {
  console.error(e);
});