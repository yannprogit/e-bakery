//------------------------ Import ------------------------
const express = require('express');
const OpenApiValidator = require('express-openapi-validator');
const cors = require('cors');

//------------------------ App ------------------------
//Init app
const app = express();
app.use(express.json());
app.use(cors({
    origin: 'http://localhost:4200'
  }));

//To use yaml
app.use(
    OpenApiValidator.middleware({
        apiSpec: './open-api.yaml',
        validateRequests: true,
        ignoreUndocumented:true
    })
  )

//Init main routers
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

const loginRouter = require('./routers/loginRouter.js');
app.use('/login', loginRouter);

app.use((error, req, res, next) => {
    res.status(error.status || 500).json({success: false, message: error.message});
});

//Export
module.exports = app;