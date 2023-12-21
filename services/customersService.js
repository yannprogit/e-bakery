//------------- Import -------------
const db = require('../models/index.js');

//------------- Methods -------------

//Return the list of customers
exports.getCustomers = async () => {
    return await db.customers.findAll();
}

//Add a customer
exports.addCustomer = async (firstname, lastname, mail, password, zipCode, adress, town) => {
    const mailExist = await db.customers.findOne({
        where: {
            mail
        }
    });
    if (!mailExist) {
        return db.customers.create({
            firstname,
            lastname,
            mail,
            password,
            zipCode,
            adress,
            town
        });
    }
    else {
        return false;
    }

}

//Return the customer by its id
exports.getCustomerById = async (id) => {
    return await db.customers.findOne({
        where: {
            id
        }
    });
}

//Delete the customer by its id
exports.deleteCustomerById = async (id) => {
    const deliveryInProgress = await db.buy.findOne({
        where: {
            customerId: id,
            validation: false,
            status: "paid"
        }
    });

    if (!deliveryInProgress) {
        db.buy.destroy({
            where: {
                customerId: id,
                status: "cart"
            }
        });

        await db.buy.update({
            customerId: null
        }, 
        { where: {
                customerId: id
            }
        });

        return db.customers.destroy({
            where: {
                id
            }
        });
    }
    else {
        return false;
    }
}

//Update the customer by its id
exports.updateCustomerByAdmin = async (id, firstname, lastname, mail, password, zipCode, adress, town) => {
    const mailExist = await db.customers.findOne({
        where: {
            mail
        }
    });
    if (!mailExist) {
    return await db.customers.update({
        firstname,
        lastname,
        mail,
        password,
        zipCode,
        adress,
        town
    }, 
    { where: {
            id
        }
    });
    }
    else {
        return false;
    }
}

//Update the customer by its id (if is the customer who update his account)
exports.updateCustomerByCustomer = async (id, mail, password, zipCode, adress, town) => {
    return await db.customers.update({
        mail,
        password,
        zipCode,
        adress,
        town
    }, 
    { where: {
            id
        }
    });
}