//-------------------- Import --------------------
const axios = require('axios');
const db = require('../models/index.js');
const bcrypt = require('bcrypt');

//-------------------- Functions --------------------
exports.populateDatabase = async (req, res) => {
    //Reset of database
    await require('../migrations/20231222143349-reset-database').up();

    //Get extern data
    const customers = await axios.get('https://little-api.vercel.app/customers');
    const employees = await axios.get('https://little-api.vercel.app/employees');
    const purchases = await axios.get('https://little-api.vercel.app/purchases');
    const foods = await axios.get('https://little-api.vercel.app/foods');
    const ingredients = await axios.get('https://little-api.vercel.app/ingredients');
    const compositions = await axios.get('https://little-api.vercel.app/compositions');

    //Code to add these data in db
    if (customers && customers.data && employees && employees.data && purchases && purchases.data && ingredients && ingredients.data && foods && foods.data && compositions && compositions.data) {
        //init data
        const customerData = customers.data;
        const employeeData = employees.data;

        //hash password for customers and employees
        for (const customer of customerData) {
 
            const hashedPassword = await bcrypt.hash(customer.password, 10);
            customer.password = hashedPassword;
        }
        for (const employee of employeeData) {
            const hashedPassword = await bcrypt.hash(employee.password, 10);
            employee.password = hashedPassword;
        }

        //Create data in database
        const resultCustomers = await db.customers.bulkCreate(customerData);
        const resultEmployees = await db.employees.bulkCreate(employeeData);
        const resultFoods = await db.foods.bulkCreate(foods.data);
        const resultIngredients = await db.ingredients.bulkCreate(ingredients.data);
        const resultCompositions = await db.contain.bulkCreate(compositions.data);
        const resultPurchases = await db.buy.bulkCreate(purchases.data);

        if (resultCustomers && resultEmployees && resultPurchases && resultCompositions && resultFoods && resultIngredients) {
            res.status(201).json({ success: true });
        }
        else {
            res.status(500).json({ success: false, message: 'Error populating database' });
        }
    } else {
        res.status(400).json({success: false, message: 'Cannot get results of extern data'});
    }
}