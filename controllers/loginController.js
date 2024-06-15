const jwt = require('jsonwebtoken');
const db = require('../models/index');
const { getRole } = require('../services/employeesService.js');
const bcrypt = require('bcrypt');
require('dotenv').config();

exports.authMiddleware = (allowedRoles) => (req, res, next) => {
    const token = req.header('Authorization');

    if (req.headers && !req.headers.authorization) {
        return res.status(401).json({ success: false, message: 'Access forbidden: You must be logged in to do this' });
    }

    jwt.verify(token, process.env.secretKey, async (err, user) => {
        if (err) {
            return res.status(403).json({ success: false, message: 'Access forbidden: The token is invalid' });
        }

        req.user = user;
        if (!allowedRoles.includes(req.user.role)) {
            return res.status(403).json({ success: false, message: 'Access forbidden: You are not allowed to do that with your role' });
        }
        next();
    });
}

exports.login = async (req, res) => {
    let user;
    let role = req.body.role.toLowerCase();
    if (role=="customer") {
        user = await db.customers.findOne({
            where: {mail: req.body.mail}
        });
    }
    else {
        user = await db.employees.findOne({
            where: {mail: req.body.mail}
        });
        if (user) {
            role = await getRole(user.role);

            let today = new Date();
            let endContract = user.endContract ? new Date(user.endContract) : null;
            if ((endContract!=null)&&(today>endContract)) {
                return res.status(422).json({success: false, message: 'Your contract has expired, you can no longer connect'});
            }
        } 
    }

    if (user) {
        const verifiedUser = await bcrypt.compare(req.body.password, user.password);
        if (verifiedUser) {
            const token = jwt.sign({ id: user.id, mail: user.mail, role: role }, process.env.secretKey, { expiresIn: '3h' });
            return res.status(200).json({success: true, token, role: role});
        } else {
            return res.status(401).json({success: false, message: 'Password is incorrect'});
        }
    } else {
        return res.status(404).json({success: false, message: 'This user doesn\'t exists'});
    }
}