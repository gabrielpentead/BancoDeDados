// middlewares/checkUser Exists.js
const User = require('../models/User');

const checkUserExists = async (req, res, next) => {
    const id = req.params.id;
    const user = await User.findById(id);
    if (!user) {
        return res.status(404).json({ msg: "Usuário não encontrado!" });
    }
    next();
};

module.exports = checkUserExists;