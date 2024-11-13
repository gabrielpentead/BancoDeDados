// middlewares/validateUser .js
const { body, validationResult } = require('express-validator');

const validateRegister = [
    body('name').notEmpty().withMessage('O nome é obrigatório.'),
    body('email').isEmail().withMessage('O e-mail deve ser válido.'),
    body('password').isLength({ min: 6 }).withMessage('A senha deve ter pelo menos 6 caracteres.'),
];

const validateLogin = [
    body('email').isEmail().withMessage('O e-mail deve ser válido.'),
    body('password').notEmpty().withMessage('A senha é obrigatória.'),
];

const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }
    next();
};

module.exports = { validateRegister, validateLogin, handleValidationErrors };