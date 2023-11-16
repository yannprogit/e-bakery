//------------- Import -------------
const { getCompositions } = require('../services/containService.js');

//------------- Methods -------------
//Get the list of compositions
exports.getCompositions = async (req, res) => {
    const contain = await getCompositions();
    res.json({success: true, data: contain});
}