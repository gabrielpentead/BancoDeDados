// models/Product.js
const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    price: { type: Number, required: true },
    type: { type: String, required: true },
    imageUrl: { type: String }, // Pode ser uma URL ou um caminho para o arquivo
    userEmail: { type: String }
});

module.exports = mongoose.model('Product', productSchema);