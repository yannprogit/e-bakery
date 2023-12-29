//------------- Import -------------
const { getEmployees, getEmployeesByRole, getEmployeeById, addEmployee, deleteEmployeeById, updateEmployeeByEmployee, updateEmployeeByAdmin, updateEndContract } = require('../services/employeesService.js');
const bcrypt = require('bcrypt');
const Ajv = require('ajv');
const ajv = new Ajv();

//------------- Methods -------------
//Get the list of employees
exports.getEmployees = async (req, res) => {
    const employees = await getEmployees();
    res.status(200).json({success: true, data: employees});
}

//Get the list of employees by their role
exports.getEmployeesByRole = async (req, res, id) => {
    const employees = await getEmployeesByRole(id);
    res.status(200).json({success: true, data: employees});
}

//Get an employee
exports.getEmployeeById = async (req, res, id, role) => {
    const employee = await getEmployeeById(req.params.id);
    if (employee==null) {
        res.status(404).json({success: false, message: "This employee doesn't exist"});
    }
    else if ((employee.id != id && role != "admin" && !(role == "manager" && employee.id == id)) || (role == "manager" && [1, 5].includes(employee.role)))  {
        res.status(403).json({ success: false, message: 'Access forbidden: You cannot view an account that does not belong to you' });
    }
    else {
        res.status(200).json({success: true, data: employee});
     }
}

//Add an employee
exports.addEmployee = async (req, res, role) => {
    if ((role=="manager")&&(req.body.role==1)) {
        res.status(422).json({success: false, message: "You cannot create an admin account"});
    }
    else {
        const employee = await addEmployee(req.body.firstname, req.body.lastname, req.body.mail, await bcrypt.hash(req.body.password, 10), req.body.role);
        if (employee) {
            res.status(201).json({success: true, data: employee});
        } else {
            res.status(422).json({success: false, message: "This mail is already linked on an account"});
        }
    }
 }

//Delete an employee
exports.deleteEmployeeById = async (req, res, id, role) => {
    const employee = await getEmployeeById(req.params.id);
    if (employee==null) {
        res.status(404).json({success: false, message: "This employee doesn't exist"});
    }
    else if (role == "manager" && [1, 5].includes(employee.role)) 
    {
        res.status(403).json({ success: false, message: "Access forbidden: You cannot delete another manager's account or admin's account" });
    }
    else {
        const deletedEmployee = await deleteEmployeeById(req.params.id);
        if (deletedEmployee) {
            res.status(204).send();
        }
        else {
            res.status(422).json({success: false, message: "This deliveryman has unfinished deliveries"});
        }
     }
}

//Update an employee
exports.updateEmployeeById = async (req, res, id, role) => {
    const employee = await getEmployeeById(req.params.id);
    if (employee==null) {
        res.status(404).json({success: false, message: "This employee doesn't exist"});
    }
    else if (role=="admin") {
        const schema = {
            type: 'object',
            properties: {
              firstname: { type: 'string' },
              lastname: { type: 'string' },
              mail: { type: 'string' },
              password: { type: 'string' },
              endContract: { type: ['string', 'null'] },
            },
            required: ['firstname', 'lastname', 'mail', 'password'],
          };
        const validateBody = ajv.validate(schema, req.body);
        const format = /^\d{4}-\d{2}-\d{2}( \d{2}:\d{2}:\d{2})?$/;
        if (!validateBody) {
            res.status(400).json({success: false, message: ajv.errors});
        }
        else if (req.body.endContract&&!format.test(req.body.endContract)) {
            res.status(400).json({ success: false, message: 'endContract must be a valid date' });
        }
        else {
            const employee = await updateEmployeeByAdmin(req.params.id, req.body.firstname, req.body.lastname, req.body.mail, await bcrypt.hash(req.body.password, 10), req.body.endContract);
            if (employee) {
                res.status(204).send();
            }
            else {
                res.status(422).json({success: false, message: "This mail is already linked on an account"});
            }
        }
    }
    else if (role=="manager") {
        const schema = {
            type: 'object',
            properties: {
              endContract: { type: ['string', 'null'] }
            }
          };
        const validateBody = ajv.validate(schema, req.body);
        const format = /^\d{4}-\d{2}-\d{2}( \d{2}:\d{2}:\d{2})?$/;
        if (!validateBody) {
            res.status(400).json({success: false, message: ajv.errors});
        }
        else if (req.body.endContract&&!format.test(req.body.endContract)) {
            res.status(400).json({ success: false, message: 'endContract must be a valid date' });
        }
        else {
            if ([1, 5].includes(employee.role)) {
                res.status(403).json({ success: false, message: 'Access forbidden: You cannot modify the account of an admin or another manager' });
            }
            else {
                const today = new Date();
                const endContractDate = new Date(req.body.endContract);
                if ((endContractDate <= today)&&(req.body.endContract!==null)) {
                    res.status(422).json({success: false, message: "This date has passed"});
                }
                else {
                    const employee = await updateEndContract(req.params.id, req.body.endContract);
                    if (!employee) {
                        res.status(422).json({success: false, message: "Deliveries are scheduled after the new contract end date"});
                    }
                    else {
                        res.status(204).send(); 
                    }
                }
            }
        }
    }
    else if (employee.id==id) {
        const schema = {
            type: 'object',
            properties: {
              mail: { type: 'string', pattern: '^[^@\s]+@[^@\s]+\.[^@\s]+$' },
              password: { type: 'string' }
            },
            required: ['mail', 'password'],
          };
        const validateBody = ajv.validate(schema, req.body);
        if (!validateBody) {
            res.status(400).json({success: false, message: ajv.errors});
        }
        else {
            const employee = await updateEmployeeByEmployee(req.params.id, req.body.mail, await bcrypt.hash(req.body.password, 10));
            if (employee) {
                res.status(204).send(); 
            }
            else {
                res.status(422).json({success: false, message: "This mail is already linked on an account"});
            }
        }
    }
    else {
        res.status(403).json({ success: false, message: 'Access forbidden: You cannot modify an account that does not belong to you' });
     }
}