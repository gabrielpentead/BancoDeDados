// models/Data.js
const mongoose = require('mongoose');

const dataSchema = new mongoose.Schema({
    _id: { type: Number, required: true },
    url: { type: String, required: true },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    unit: { type: String, required: true },
    type: { type: String, required: true }
});

module.exports = mongoose.model('Data', dataSchema);