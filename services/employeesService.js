//------------- Import -------------
const db = require('../models/index.js');
const { Op } = require('sequelize');

//------------- Methods -------------
//Return the list of employees
exports.getEmployees = async () => {
    return await db.employees.findAll();
}

//Get the name of employee's role 
exports.getRole = async (id) => {
    const role = await db.roles.findOne({
        attributes: ['name'],
        where: {
            id
        }
    });

    return role.name;
}

//Return the list of specific employees by their role
exports.getEmployeesByRole = async (id) => {
    return await db.employees.findAll({
        where: {
            role: id
        }
    });
}

//Return the employee by its id
exports.getEmployeeById = async (id) => {
    return await db.employees.findOne({
        where: {
            id
        }
    });
}

//Add a employee
exports.addEmployee = (firstname, lastname, mail, password, role) => {
    return db.customers.create({
        firstname,
        lastname,
        mail,
        password,
        role
    });
}

//Delete the employee by its id
exports.deleteEmployeeById = async (id) => {
    const employee = await db.employees.findOne({
        where: {
            id
        }
    });

    if (employee.role==2) {
        const deliveryInProgress = await db.buy.findOne({
            where: {
                deliverymanId: id,
                validation: false,
                status: "paid"
            }
        });

        if (deliveryInProgress) {
            return false;
        }
        await db.buy.update({
            deliverymanId: null
        }, 
        { where: {
                deliverymanId: id
            }
        });
    }

    return db.employees.destroy({
        where: {
            id
        }
    });
}

//Update the employee by its id (by admin)
exports.updateEmployeeByAdmin = async (id, firstname, lastname, mail, password, role) => {
    const mailExist = await db.employees.findOne({
        where: {
            mail
        }
    });
    if (!mailExist) {
    return await db.employees.update({
        firstname,
        lastname,
        mail,
        password,
        role
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

//Update the employee by its id (if is the employee who update his account)
exports.updateEmployeeByEmployee = async (id, mail, password) => {
    return await db.employees.update({
        mail,
        password
    }, 
    { where: {
            id
        }
    });
}

//Update the date of end of contract of employee by its id
exports.updateEndContract = async (id, endContract) => {
    const deliveriesInProgress = await db.buy.findAll({
        where: {
            deliverymanId: id,
            [Op.or]: [
                { dueDate: { [Op.gt]: endContract } },
                { validation: false }
            ]
        }
    });

    if (deliveriesInProgress) {
        return "deliveriesInProgress";
    }

    return await db.employees.update({
        endContract
    }, 
    { where: {
            id
        }
    });
}