//------------- Import -------------
const { getEmployees, getEmployeesByRole, addEmployee, deleteEmployeeById, getEmployeeById } = require('../services/employeesService.js');

//------------- Methods -------------
//Get the list of employees
exports.getEmployees = async (req, res) => {
    const employees = await getEmployees();
    res.json({success: true, data: employees});
}

//Get the list of employees by their role
exports.getEmployeesByRole = async (req, res, id) => {
    const employees = await getEmployeesByRole(id);
    res.status(200).json({success: true, data: employees});
}

//Get a customer
exports.getEmployeeById = async (req, res, id, role) => {
    const employee = await getEmployeeById(req.params.id);
    if (employee==null) {
        res.status(404).json({success: false, message: "This employee doesn't exist"});
    }
    else if ((employee.id != id && role != "admin" && !(role == "manager" && employee.id == id)) || (role == "manager" && [1, 5].includes(employee.role)))  {
        res.status(401).json({ success: false, message: 'Access forbidden' });
    }
    else {
        res.status(200).json({success: true, data: employee});
     }
}

//Add a employee
exports.addEmployee = async (req, res) => {
    const employee = await addEmployee(req.body.firstname, req.body.lastname, req.body.mail, await bcrypt.hash(req.body.password, 10), req.body.role);
    if (employee) {
        res.status(201).json({success: true, data: employee});
    } else {
        res.status(400).json({success: false, message: "Error when creating this employee, verify your args"});
    }
 }

//Delete a employee
exports.deleteEmployeeById = async (req, res, id, role) => {
    const employee = await getEmployeeById(req.params.id);
    if (employee==null) {
        res.status(404).json({success: false, message: "This employee doesn't exist"});
    }
    else if (role == "manager" && [1, 5].includes(employee.role)) 
    {
        res.status(401).json({ success: false, message: 'Access forbidden' });
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