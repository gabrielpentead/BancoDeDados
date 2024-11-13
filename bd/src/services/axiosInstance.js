// src/services/axiosInstance.js
import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: 'http://localhost:5000/api', // Substitua pela URL da sua API
    timeout: 10000, // Tempo limite da requisição
});

export default axiosInstance;