//------------- Import -------------
const db = require('../models/index.js');

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