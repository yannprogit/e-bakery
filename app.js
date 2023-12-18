//Import
const express = require('express');
//For yaml
const OpenApiValidator = require('express-openapi-validator');

//App
const app = express();
app.use(express.json());

//To use yaml
app.use(
    OpenApiValidator.middleware({
        apiSpec: './open-api.yaml',
        ignoreUndocumented:true
    })
  )

  app.use((req,res, next)=> {
    const name = 'Middleware A';
    console.log(name);
    req.middlewareAName = name;
    next();
  });

  app.use((req,res, next)=> {
    const name = 'Middleware B';
    console.log(name);
    next();
  });

  app.use(errorMiddleware);

// Example of using the middleware in a specific route
const employeesRouter = require('./routers/employeesRouter.js');
// Middleware C specific to the employees route
employeesRouter.use((req,res, next)=> {
    const name = 'Middleware C for Employees Route'
    console.log(name);
    next();
})

app.use('/employees', employeesRouter);


const customersRouter = require('./routers/customersRouter.js');
// Middleware D specific to the customer route
customersRouter.use((req,res, next)=> {
  const name = 'Middleware D for customer Route'
  console.log(name);
  next();
})

app.use('/customers', customersRouter);

const ingredientsRouter = require('./routers/ingredientsRouter.js');
// Middleware E specific to the ingredient route
ingredientsRouter.use((req,res, next)=> {
  const name = 'Middleware E for ingredient Route'
  console.log(name);
  next();
})

app.use('/ingredients', ingredientsRouter);


const foodsRouter = require('./routers/foodsRouter.js');
// Middleware F specific to the food route
foodsRouter.use((req,res, next)=> {
  const name = 'Middleware F for food Route'
  console.log(name);
  next();
})

app.use('/foods', foodsRouter);

const buyRouter = require('./routers/buyRouter.js');
// Middleware G specific to the buy route
buyRouter.use((req,res, next)=> {
  const name = 'Middleware G for buy Route'
  console.log(name);
  next();
})

app.use('/purchases', buyRouter);


const containRouter = require('./routers/containRouter.js');
// Middleware H specific to the contain route
containRouter.use((req,res, next)=> {
  const name = 'Middleware H for contain Route'
  console.log(name);
  next();
})

app.use('/compositions', containRouter);

const loginRouter = require('./routers/loginRouter.js')
// Middleware I specific to the login route
loginRouter.use((req,res, next)=> {
  const name = 'Middleware I for login Route'
  console.log(name);
  next();
})

app.use('/login', loginRouter)


//Export
module.exports = app;
