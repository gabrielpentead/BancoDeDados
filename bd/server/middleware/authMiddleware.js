const admin = require('firebase-admin'); // Certifique-se de ter o Firebase Admin SDK instalado

// Middleware para verificar o token do usuário
const authenticateUser  = async (req, res, next) => {
    const token = req.headers.authorization?.split('Bearer ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Token de autenticação não fornecido' });
    }

    try {
        const decodedToken = await admin.auth().verifyIdToken(token);
        req.user = { uid: decodedToken.uid, email: decodedToken.email };
        next();
    } catch (error) {
        console.error('Erro ao verificar token:', error);
        res.status(403).json({ message: 'Token de autenticação inválido' });
    }
};
module.exports = authenticateUser ;