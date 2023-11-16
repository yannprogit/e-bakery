//------------- Import -------------
const db = require('../models/index.js');

//------------- Methods -------------

//Return the list of compositions
exports.getCompositions = async () => {
    return await db.contain.findAll();
}