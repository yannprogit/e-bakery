const app = require('./app');
const db = require('./models/index.js');
const port = 8000;

db.sequelize.sync({force: true}).then(async () => {
  console.log('Database connected and synchronized');

  //Add roles
  await db.roles.bulkCreate([
    { id: 1, name: 'admin' },
    { id: 2, name: 'deliveryman' },
    { id: 3, name: 'cook' },
    { id: 4, name: 'cashier' },
    { id: 5, name: 'manager' },
  ]);

    //Add ingredients
    await db.ingredients.bulkCreate([
      { name: 'Levure' },
      { name: 'Sel' },
      { name: 'Eau' },
      { name: 'Farine' },
      { name: 'Sucre' },
      { name: 'Pâte feuilleté' },
      { name: 'Chocolat' },
      { name: 'Oeuf' },
    ]);

  //Add employees
  await db.employees.bulkCreate([
    {
      firstname: 'Hamp',
      lastname: 'Loyé',
      mail: 'hamp.loye@gmail.com',
      password: 'mdp2',
      role: 3,
    },
    {
      firstname: 'Yacowan',
      lastname: 'Keebrady',
      mail: 'yacowan.keebrady@gmail.com',
      password: 'mdp1',
      role: 1,
    },
    {
      firstname: 'Ali',
      lastname: 'Expe-Rèss',
      mail: 'ali.er@gmail.com',
      password: 'mdp3',
      role: 2,
    },
    {
      firstname: 'Pix',
      lastname: 'Sous',
      mail: 'pix.sous@gmail.com',
      password: 'mdp4',
      role: 4,
    },
    {
      firstname: 'Mana',
      lastname: 'Jeur',
      mail: 'mana.jeur@gmail.com',
      password: 'mdp5',
      role: 5,
    },
  ]);

  //Add customer
  await db.customers.create({
    firstname: 'Klie',
    lastname: 'Yen',
    mail: 'klie.yen@gmail.com',
    password: 'mdp1',
  });

  //Add food
  await db.foods.create({
    name: 'Baguette',
    price: 3.50,
  });

  //Add in contain
  await db.contain.bulkCreate([
    { foodId: 1, ingredientId: 1 },
    { foodId: 1, ingredientId: 2 },
    { foodId: 1, ingredientId: 3 },
    { foodId: 1, ingredientId: 4 },
  ]);

  app.listen(port, () => {
    console.log('Server is running on http://localhost:' + port);
  });
}).catch((e) => {
  console.error(e);
});