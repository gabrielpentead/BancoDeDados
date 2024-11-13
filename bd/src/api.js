// src/api.js
import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:5000/api/filters',
});

// Função para buscar todos os produtos
export const fetchProducts = async (params = {}) => {
    try {
        const response = await api.get('/', { params });
        return response.data;
    } catch (error) {
        console.error('Erro ao buscar produtos:', error.response ? error.response.data : error.message);
        throw error; // Re-lança o erro para que possa ser tratado no componente
    }
};

// Função para buscar produtos do tipo 'fruta'
export const fetchFrutas = async () => {
    return fetchProducts({ type: 'fruta' });
};

// Função para buscar produtos do tipo 'outros'
export const fetchOutros = async () => {
    return fetchProducts({ type: 'outro' });
};

// Função para buscar produtos do tipo 'hortalica'
export const fetchHortalica = async () => {
    return fetchProducts({ type: 'hortalica' });
};

// Função para buscar produtos do tipo 'legumes'
export const fetchLegumes = async () => {
    return fetchProducts({ type: 'legume' });
};

// Função para buscar produtos do tipo 'verdura'
export const fetchVerduras = async () => {
    return fetchProducts({ type: 'verdura' });
};

// Função para adicionar um novo produto
export const addProduct = async (product) => {
    try {
        const response = await api.post('/add', product);
        return response.data;
    } catch (error) {
        console.error('Erro ao adicionar produto:', error.response ? error.response.data : error.message);
        throw error;
    }
};