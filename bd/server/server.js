const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const connectDB = require('./connect/db');
const productsRouter = require('./routes/products');
const filtersRouter = require('./routes/filters');
const errorHandler = require('./middleware/errorHandler');
const path = require('path');
const fs = require('fs');
const authenticateUser = require('./middleware/authMiddleware');
require('dotenv').config();

const app = express();
const admin = require('firebase-admin');
const serviceAccount = require(process.env.DATABASE_URL);

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://<SEU-PROJETO>.firebaseio.com" // Substitua pelo URL do seu banco de dados
});

// Função para configurar middlewares
function setupMiddlewares(app) {
    app.use(helmet({
        contentSecurityPolicy: false,
    }));
    app.use(morgan('dev'));
    app.use(cookieParser());

    // Configura o CORS para o domínio do frontend
    app.use(cors({
        origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
        allowedHeaders: ['Content-Type', 'Authorization'],
    }));
    
    app.use((req, res, next) => {
        res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');  // Permite acesso de outros domínios
        next();
    });
    
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));

    // Verifica se a pasta 'imagens' existe, se não, cria
    const imagesDir = path.join(__dirname, 'imagens');
    if (!fs.existsSync(imagesDir)) {
        fs.mkdirSync(imagesDir);
    }
    // Serve arquivos estáticos da pasta 'imagens'
    app.use('/imagens', express.static(imagesDir));
}

// Conectar ao MongoDB
async function startServer() {
    try {
        await connectDB();
        console.log('Conectado ao MongoDB');

        // Configurar middlewares
        setupMiddlewares(app);

        // Configurar rotas
        app.use('/api/products', productsRouter);
        app.use('/api/filters', filtersRouter);

        // Middleware para tratamento de rotas não encontradas
        app.use((req, res) => {
            res.status(404).json({ msg: 'Rota não encontrada' });
        });

        // Middleware de tratamento de erros
        app.use(errorHandler);

        // Inicia o servidor
        const PORT = process.env.PORT || 5000;
        app.listen(PORT, () => {
            console.log(`Servidor rodando na porta ${PORT}`);
        });
    } catch (err) {
        console.error('Erro ao conectar ao MongoDB:', err);
        process.exit(1);
    }
}

// Iniciar o servidor
startServer();
