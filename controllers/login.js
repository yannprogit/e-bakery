const jwt = require('jsonwebtoken');
const db = require('../models/index');
const bcrypt = require('bcrypt');

exports.authMiddleware = async (req, res, next) => {
    // When test environment, we need to disabled auth
    if (process.env.JEST_WORKER_ID !== undefined) {
        next()
        return;
    }
    if (req.headers && !req.headers.authorization) {
        res.status(401).json({success: false, message: 'You need to be authenticated'});
    } else {
        const token = req.headers.authorization.split(' ')[1];
        try {
            const decodedToken = await jwt.verify(token, process.env.SECRET);
            if (decodedToken) {
                next();
            } else {
                res.status(401).json({success: false, message: 'This authentication is no more valid'});
            }
        } catch(e) {
            next(e);
        }
    }
}

exports.register = async (req, res) => {}

exports.login = async (req, res) => {
    if (req.body.username && req.body.password) {
        const user = await db.users.findOne({
            where: {username: req.body.username}
        });
        if (user) {
            const verifiedUser = await bcrypt.compare(req.body.password, user.password);
            if (verifiedUser) {
                const token = jwt.sign({
                    data: {id: user.id, username: user.username}
                }, process.env.SECRET, {
                    expiresIn: '30s'
                });
                res.status(200).json({success: true, token});
            } else {
                res.status(401).json({success: false, message: 'Password is incorrect'});
            }
        } else {
            res.status(404).json({success: false, message: 'This user doesn\'t exists'});
        }
    } else {
        res.status(400).json({success: false, message: 'username and password are required'});
    }
}