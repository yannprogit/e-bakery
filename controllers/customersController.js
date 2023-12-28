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
    const customer = await addCustomer(req.body.firstname, req.body.lastname, req.body.mail, await bcrypt.hash(req.body.password, 10), req.body.zipCode, req.body.address, req.body.town);
    if (customer) {
        res.status(201).json({success: true, customer: customer});
    } else {
        res.status(422).json({success: false, message: "This mail is already linked on an account"});
    }
 }

//Get a customer
exports.getCustomerById = async (req, res, id, role) => {
    const customer = await getCustomerById(req.params.id);
    if (customer==null) {
        res.status(404).json({success: false, message: "This customer doesn't exist"});
    }
    else if ((customer.id != id)&&(role!="admin")) {
        res.status(403).json({ success: false, message: 'Access forbidden: You cannot view an account that does not belong to you' });
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
        res.status(403).json({ success: false, message: 'Access forbidden: You cannot delete an account that does not belong to you' });
    }
    else {
        const deletedCustomer = await deleteCustomerById(req.params.id);
        if (deletedCustomer) {
            res.status(204).send();
        }
        else {
            res.status(422).json({success: false, message: "It would appear that you still have deliveries in progress"});
        }
     }
}

//Update a customer
exports.updateCustomerById = async (req, res, id, role) => {
    const customer = await getCustomerById(req.params.id);
    if (customer==null) {
        res.status(404).json({success: false, message: "This customer doesn't exist"});
    }
    else if (role=="admin") {
        const customer = await updateCustomerByAdmin(req.params.id, req.body.firstname, req.body.lastname, req.body.mail, await bcrypt.hash(req.body.password, 10), req.body.zipCode, req.body.address, req.body.town);
        if (customer) {
            res.status(204).send();
        }
        else {
            res.status(422).json({success: false, message: "This mail is already linked on an account"});
        }
    }
    else if (role=="customer"&&customer.id==id) {
        const customer = await updateCustomerByCustomer(req.params.id, req.body.mail, await bcrypt.hash(req.body.password, 10), req.body.zipCode, req.body.address, req.body.town);
        if (customer) {
            res.status(204).send();
        }
        else {
            res.status(422).json({success: false, message: "This mail is already linked on an account"});
        }
    }
    else {
        res.status(403).json({ success: false, message: 'Access forbidden: You cannot modify an account that does not belong to you' });
     }
}