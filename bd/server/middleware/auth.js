// middlewares/auth.js
const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
  const token = req.header('Authorization')?.split(' ')[1]; // Espera o token no formato "Bearer TOKEN"

  if (!token) {
    return res.status(403).json({ message: 'Acesso negado' });
  }

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified; // Adiciona os dados do usuário à requisição
    next();
  } catch (error) {
    res.status(400).json({ message: 'Token inválido' });
  }
};

module.exports = auth;