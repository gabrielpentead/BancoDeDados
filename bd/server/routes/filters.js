// routes/filters.js
const express = require('express');
const Product = require('../models/Product');
const router = express.Router();

router.get('/', async (req, res) => {
    const { type, name, price, imageUrl, page = 1, limit = 10 } = req.query;

    const filter = {};
    if (type) filter.type = type;
    if (name) filter.name = { $regex: name, $options: 'i' };
    if (price) filter.price = price;
    if (imageUrl) filter.imageUrl = imageUrl;

    try {
        const products = await Product.find(filter)
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .exec();

        const count = await Product.countDocuments(filter);

        if (products.length === 0) {
            return res.status(404).json({ message: 'Nenhum produto encontrado' });
        }

        res.json({
            products,
            totalPages: Math.ceil(count / limit),
            currentPage: page
        });
    } catch (error) {
        console.error('Erro ao buscar produtos:', error);
        res.status(500).json({ message: 'Erro ao buscar produtos' });
    }
});

// Rota para obter produtos com filtros


router.get('/products/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const product = await Product.findById(id);
        if (!product) {
            return res.status(404).json({ message: 'Produto não encontrado' });
        }
        res.json(product);
    } catch (error) {
        console.error('Erro ao buscar produto:', error);
        res.status(500).json({ message: 'Erro ao buscar produto' });
    }
});

// Rota para buscar um único produto
router.get('/:id', async (req, res) => {
    try {
      const product = await Product.findById(req.params.id); // Busca o produto pelo ID
      if (!product) {
        return res.status(404).json({ message: 'Produto não encontrado' });
      }
      res.json(product); // Retorna os dados do produto
    } catch (error) {
      console.error('Erro ao obter produto:', error);
      res.status(500).json({ message: 'Erro ao obter produto' });
    }
  });
  
  // Rota para buscar produtos relacionados com o mesmo tipo
router.get('/', async (req, res) => {
    try {
      const { type } = req.query; // Pega o tipo passado pela query params (type)
      
      if (!type) {
        return res.status(400).json({ message: 'Tipo não fornecido' });
      }
  
      // Busca produtos com o mesmo tipo
      const products = await Product.find({ type: type });
  
      res.json(products); // Retorna os produtos encontrados
    } catch (error) {
      console.error('Erro ao obter produtos relacionados:', error);
      res.status(500).json({ message: 'Erro ao obter produtos' });
    }
  });
  

module.exports = router;