//Import
const express = require('express');

//App
const app = express();

//const employeesRouter = require('./routers/employeesRouter.js');
//app.use('/employees', employeesRouter);

const customersRouter = require('./routers/customersRouter.js');
app.use('/customers', customersRouter);

//Export
module.exports = app;