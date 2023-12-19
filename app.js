//Import
const express = require('express');

//App
const app = express();
app.use(express.json());

const axiosRouter = require('./routers/axiosRouter.js');
app.use('/populate-db', axiosRouter);

const employeesRouter = require('./routers/employeesRouter.js');
app.use('/employees', employeesRouter);

const customersRouter = require('./routers/customersRouter.js');
app.use('/customers', customersRouter);

const ingredientsRouter = require('./routers/ingredientsRouter.js');
app.use('/ingredients', ingredientsRouter);

const foodsRouter = require('./routers/foodsRouter.js');
app.use('/foods', foodsRouter);

const buyRouter = require('./routers/buyRouter.js');
app.use('/purchases', buyRouter);

const containRouter = require('./routers/containRouter.js');
app.use('/compositions', containRouter);

const loginRouter = require('./routers/loginRouter.js')
app.use('/login', loginRouter)

//Export
module.exports = app;