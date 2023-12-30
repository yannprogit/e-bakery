# About the project:
E-bakery is an online bakery api open 24 hours a day, every day, where you can order food and have it delivered.

This api responds to the fact that we don't necessarily have a bakery nearby, and so we cannot enjoy the world's different pastries, which is sad, and that is how E-bakery solves this problem.

# Getting started:
- Create an empty database named "e-bakery" on phpmyadmin or similar, the database will be automatically filled
- execute "npm install"
- execute "node server.js"
- you can populate the database with the /populate-db route (you will need to be logged in with an admin account to do this (mail: "yacowan.keebrady@gmail.com", password: "mdp")).

# How it works:

# Ressources:
- Customer : se sont les clients qui peuvent commander de la nourriture, table: customers (id, firstname, lastname, mail, zipCode, address, town)

- Employee : se sont les employees qui gère la boulangerie, ils peuvent être de différents roles (admin , manager, cashier, baker, deliveryman), table: employees (id, fistname, lastname, mail, role, endContract)

- Food : se sont les nourritures disponibles dans la boulangerie, table: foods (id, name, price, description, stock)

- Ingredient : se sont les ingrédients qui servent à composer les nourritures, table: ingredients (id, name, stock)

- Contain : se sont les compositions qui relient les foods aux ingredients, table: contain (foodId, ingredientId)

- Buy : se sont les achats des clients, table: buy (id, customerId, foodId, deliverymanId, qty, dueDate, deliveryDate, status, validation)

Although there's a roles table that gives the employee roles, it can't be get, add, update or delete, as it doesn't need to be modified, as the roles will always be the same.

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
        - delete buy (if the status is "cart")
    - /customers:
        - get its account
        - update its account
        - delete its account

- Employees:
    - for all:
        - /employees:
            - get their account
            - update their account (only mail and password) (except for manager who don't do that and admin who can change everything)
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
            - get its buy (for delivery)
            - update its buy (the deliveryDate)

# About the team:
The project was realized by Yann Sady and Nicolas Keerpal.

We had a final developer Swan Breton, but unfortunately he had to leave the project on December 12, 2023, we still thank him for his contribution.