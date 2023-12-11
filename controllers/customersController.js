//------------- Import -------------
const { getCustomers, getCustomerById, addCustomer, deleteCustomerById, updateCustomerByAdmin, updateCustomerByCustomer } = require('../services/customersService.js');
const bcrypt = require('bcrypt');

//------------- Methods -------------
//Get the list of customers
exports.getCustomers = async (req, res) => {
    const customers = await getCustomers();
    res.status(200).json({success: true, data: customers});
}

//Add a customer
exports.addCustomer = async (req, res) => {
    const customer = await addCustomer(req.body.firstname, req.body.lastname, req.body.mail, await bcrypt.hash(req.body.password, 10));
    if (customer) {
        res.status(201).json({success: true, customer: customer});
    } else {
        res.status(400).json({success: false, message: "Error when creating this customer, verify your args"});
    }
 }

//Get a customer
exports.getCustomerById = async (req, res, id, role) => {
    const customer = await getCustomerById(req.params.id);
    if (customer==null) {
        res.status(404).json({success: false, message: "This customer doesn't exist"});
    }
    else if ((customer.id != id)&&(role!="admin")) {
        res.status(401).json({ success: false, message: 'Access forbidden' });
    }
    else {
        res.status(200).json({success: true, data: customer});
     }
}

//Delete a customer
exports.deleteCustomerById = async (req, res, id, role) => {
    const customer = await getCustomerById(req.params.id);
    if (customer==null) {
        res.status(404).json({success: false, message: "This customer doesn't exist"});
    }
    else if ((customer.id != id)&&(role!="admin")) {
        res.status(401).json({ success: false, message: 'Access forbidden' });
    }
    else {
        deleteCustomerById(req.params.id);
        res.status(204).send();
     }
}

//Update a customer
exports.updateCustomerById = async (req, res, id, role) => {
    const customer = await getCustomerById(req.params.id);
    if (customer==null) {
        res.status(404).json({success: false, message: "This customer doesn't exist"});
    }
    else if (role=="admin") {
        const customer = await updateCustomerByAdmin(req.params.id, req.body.firstname, req.body.lastname, req.body.mail, req.body.password);
        if (customer) {
            res.status(204).send();
        }
        else {
            res.status(400).json({success: false, message: "Error when updating this customer, verify your args"});
        }
    }
    else if (role=="customer"&&customer.id==id) {
        const customer = await updateCustomerByCustomer(req.params.id, req.body.mail, req.body.password);
        if (customer) {
            res.status(204).send(); 
        }
        else {
            res.status(400).json({success: false, message: "Error when updating this customer, verify your args"});
        }
    }
    else {
        res.status(401).json({ success: false, message: 'Access forbidden' });
     }
}