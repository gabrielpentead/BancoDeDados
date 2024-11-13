// routes/upload.js
const express = require('express');
const multer = require('multer');
const path = require('path');

const router = express.Router();

// Configuração do multer para armazenar arquivos na pasta 'imagens'
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'imagens/'); // Pasta onde as imagens serão armazenadas
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // Nome do arquivo com timestamp
    },
});

const upload = multer({ storage });

// Rota para upload de arquivos
router.post('/imagens', upload.single('image'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: 'Nenhum arquivo enviado' });
    }
    res.status(201).json({ message: 'Arquivo enviado com sucesso', filePath: req.file.path });
});

module.exports = router;