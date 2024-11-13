const express = require('express');
const Product = require('../models/Product');
const { body, validationResult } = require('express-validator');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const authenticateUser = require('../middleware/authMiddleware');  // Import the correct path for the middleware

const router = express.Router();

const uploadsDir = path.join(__dirname, 'imagens');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir);
}

// Configuração do Multer para upload de imagens
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'imagens/'); // Pasta onde as imagens serão armazenadas
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname); // Nome do arquivo com timestamp
    },
});

const upload = multer({ storage });

// Rota para adicionar um produto
router.post('/', upload.single('image'), async (req, res) => {
    try {
        const { name, price, type, userEmail } = req.body;

        // Validação básica
        if (!name || !price || !type) {
            return res.status(400).json({ message: 'Nome, preço e tipo são obrigatórios' });
        }

        // Criar um novo produto
        const newProduct = new Product({
            name,
            price,
            type,
            imageUrl: req.file ? req.file.path : null, // Salva o caminho da imagem se existir
            userEmail
        });

        // Salvar o produto no banco de dados
        await newProduct.save();
        res.status(201).json(newProduct);
    } catch (error) {
        console.error('Erro ao adicionar produto:', error);
        res.status(500).json({ message: 'Erro ao adicionar produto' });
    }
});

// Rota para obter todos os produtos
router.get('/', async (req, res) => {
    try {
        const products = await Product.find();
        res.json(products);
    } catch (error) {
        console.error('Erro ao obter produtos:', error);
        res.status(500).json({ message: 'Erro ao obter produtos' });
    }
});

// Rota para atualizar um produto
router.put('/:id', authenticateUser, upload.single('image'), async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: 'Produto não encontrado' });
        }

        // Verifique se o usuário é o proprietário do produto
        if (product.userEmail !== req.user.email) { // Assuming `email` is stored in `user` JWT
            return res.status(403).json({ message: 'Acesso negado. Você não pode editar este produto.' });
        }

        const updateData = {
            name: req.body.name,
            price: req.body.price,
            type: req.body.type,
        };

        if (req.file) {
            updateData.imageUrl = req.file.path; // Atualiza a imagem se uma nova for enviada
        }

        const updatedProduct = await Product.findByIdAndUpdate(req.params.id, updateData, { new: true });
        res.json({ message: 'Produto atualizado com sucesso', product: updatedProduct });
    } catch (error) {
        console.error('Erro ao atualizar produto:', error);
        res.status(500).json({ message: 'Erro ao atualizar produto' });
    }
});

// Rota para excluir um produto
router.delete('/:id', authenticateUser, async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: 'Produto não encontrado' });
        }

        // Verifique se o usuário é o proprietário do produto
        if (product.userEmail !== req.user.email) { // Ensure it’s the same user
            return res.status(403).json({ message: 'Acesso negado. Você não pode deletar este produto.' });
        }

        await Product.findByIdAndDelete(req.params.id);
        res.json({ message: 'Produto deletado com sucesso' });
    } catch (error) {
        console.error('Erro ao deletar produto:', error);
        res.status(500).json({ message: 'Erro ao deletar produto' });
    }
});
 
  

module.exports = router;