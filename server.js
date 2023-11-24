const app = require('./app');
const db = require('./models/index.js');
const port = 8000;

db.sequelize.sync({force: false}).then(async () => {
  console.log('Database connected and synchronized');

  app.listen(port, () => {
    console.log('Server is running on http://localhost:', port);
  });
}).catch((e) => {
  console.error(e);
});