# About the project:
E-bakery is an online bakery api open 24 hours a day, every day, where you can order food and have it delivered.

This api responds to the fact that we do not necessarily have a bakery nearby, and so we cannot enjoy the world's different pastries, which is sad, and that is how E-bakery solves this problem.

# Getting started:
- Create an empty database named "e-bakery" on phpmyadmin or similar, the database will be automatically filled
- place the .env file at the root of the project
- run "npm install"
- run "node server.js"
- you can populate the database with the /populate-db route (you must post without body on this route) (you will need to be logged in with an admin account to do this (mail: "yacowan.keebrady@gmail.com", password: "mdp")).

# Ressources:
- Customer: customers can order food, table: customers (id, firstname, lastname, mail, zipCode, address, town)

- Employee : these are the employees who manage the bakery, they can have different roles (admin , manager, cashier, baker, deliveryman), table: employees (id, fistname, lastname, mail, role, endContract)

- Food : food available in the bakery, table: foods (id, name, price, description, stock)

- Ingredient : the ingredients used to make up the foods, table: ingredients (id, name, stock)

- Contain: compositions linking foods to ingredients, table: contain (foodId, ingredientId)

- Buy: customer purchases, table: buy (id, customerId, foodId, deliverymanId, qty, dueDate, deliveryDate, status, validation)

Although there's a roles table that gives the employee roles, it cannot be get, add, update or delete, as it does not need to be modified, as the roles will always be the same.

# How it works:
- To order :
    The customer must first add a buy by specifying the desired foodId and qty. The buy will be added to the user's shopping cart, (the status of the buy will be "cart" in the database). At this point, the customer can delete the order as it has not yet been confirmed.

    Next, the customer can confirm the order by updating the status of the order (from "cart" to "paid") and choosing the time of day at which he wishes to be delivered.

    A free deliveryman will be randomly assigned to this order, and the dueDate will be 4 days longer than today.

    If the customer places another order for the same day at the same time, the order will be assigned to the same deliveryman, who will be able to deliver to the customer at the same time.

    The deliveryman will then be able to update the deliveryDate once he has delivered to the customer.

    Finally, the customer can confirm that the deliveryman has delivered (validation will change from false to true in the database).

- For online bakery management :
    - Account management :
        - Customer :
            He can view his account and modify his account information (mail, password, zip code, address and town), to modify his firstname and lastname, he must ask the admin.
            He can delete his account only if it is not being delivered.
        - Employee :
            The manager/admin adds employees and can delete them (except the deliveryman if he has deliveries in progress).
            Employees (except the manager, who must ask the admin) can modify their mail and password, and as for the customer, they must ask the admin for their firstname and lastname.

            The manager can change an employee's end-of-contract date, and the employee will no longer be able to log in once this date has passed. Deliverymen whose contract end date has passed will no longer be assigned to deliveries.

    - Food management (and all those related to it) :
        - Food :
            Everyone can get foods and contain them, to see what foods are available and contain them so that a customer can see if there's an ingredient he's allergic to.

            The baker can add new foods, delete them (unless the food is being delivered) and modify them.

            When deleting food, links in the contain table will be deleted and orders already delivered will have their foodId set to null.

            In addition to modifying its name and description, the baker can add food stocks (which will consume ingredient stocks).

            You can't add stock to food if it doesn't have a composition in the contain table.

            The cashier can modify the food's price.

        - Ingredient :
            Ingredients work in a similar way to food. The baker can add, modify, delete and get ingredients.

            When deleting, the ingredient links will be deleted and the baker can add stocks to the ingredients.

        - Contain: 
            Contain table compositions link foods to ingredients. A baker can add, delete or modify an ingredient that makes up a food.

            The baker can delete either a contain or all the compositions of a food. 

# Postman collection: 
requirements: the collection and environment "eBakeryEnvironment"

You have been provided with a postman collection, which you can use to test the api. The tests have been designed to be run in order (except for the login file) to cover all cases smoothly.

You can start with the "To begin" folder, in the login folder there are accounts available for testing rights.

# Rights :
There are 2 types of users, customers and employees, and among the employees, there are admin, manager, baker, cashier, deliveryman.

All the world's can get foods and compositions (contain's table)

- Customers: 
    - /purchases:
        - add a buy
        - get its buy
        - update its buy (status and validation)
        - delete its buy (if the status is "cart")
    - /customers:
        - get its account
        - update its account (mail and password)
        - delete its account

- Employees:
    - for all:
        - /employees:
            - get their account
            - update their account (only mail and password) (except for manager who do not do that and admin who can change everything)
    - admin:
        - all (except add a buy)
    - manager:
        - /employees:
            - add an employee (except admin)
            - delete an employee (except admin and other managers)
            - update the end contract of employee
            - get employees (except admin and other managers)
    - baker:
        - /foods:
            - add a food
            - update a food (except price)
            - delete a food
        - /ingredients:
            - get ingredients
            - add an ingredient
            - update a ingredient
            - delete a ingredient   
        - /compositions:
            - add a contain
            - update a contain
            - delete a contain     
    - cashier:
        - /foods:
            - update price of food 
        - /purchases:
            - get all purchases (but not individually because cashier just needs to see the overall purchases in order to make an average, calculate revenues etc...)
    - deliveryman:
        - /purchases:
            - get its buy (for the delivery)
            - update its buy (the deliveryDate)

# About the team:
The project was realized by Yann Sady and Nicolas Keerpal.

We had a final developer Swan Breton, but unfortunately he had to leave the project on December 12, 2023, we still thank him for his contribution.