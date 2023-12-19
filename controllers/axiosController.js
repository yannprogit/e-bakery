//-------------------- Import --------------------
const axios = require('axios');

//-------------------- Functions --------------------
exports.getExternFoods = async (req, res) => {
    const result = await axios.get('https://little-api.vercel.app/foods');
    if (result && result.data) {
        res.json(result.data);
    } else {
        res.status(400).json({success: false, message: 'Cannot get foods result'});
    }
}