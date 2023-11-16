//------------- Import -------------
const { getPurchases } = require('../services/buyService.js');

//------------- Methods -------------
//Get the list of purchases
exports.getPurchases = async (req, res) => {
    const buy = await getPurchases();
    res.json({success: true, data: buy});
}