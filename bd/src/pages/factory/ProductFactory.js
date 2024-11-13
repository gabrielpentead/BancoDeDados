// src/page/factory/ProductFactory.js
import axios from 'axios';

class ProductFactory {
    constructor() {
        // Implementa o padrão Singleton
        if (!ProductFactory.instance) {
            ProductFactory.instance = this;
        }
        return ProductFactory.instance;
    }

    // Método para buscar produtos da API
    async fetchProductsFromAPI() {
        try {
            const response = await axios.get('http://localhost:5000/api/products'); // URL da sua API
            return response.data; // Retorna os produtos
        } catch (error) {
            console.error('Erro ao buscar produtos:', error);
            throw new Error('Erro ao buscar produtos da API: ' + error.message); // Re-lança o erro com mensagem
        }
    }

    // Método para criar produtos por tipo
    async createProductByType(type) {
        const validTypes = ['fruta', 'verdura', 'legume', 'hortalica', 'outro'];

        // Valida o tipo
        if (!validTypes.includes(type)) {
            throw new Error(`Tipo inválido: ${type}. Tipos válidos são: ${validTypes.join(', ')}`);
        }

        try {
            // Faz a chamada à API para buscar produtos filtrados pelo tipo
            const response = await axios.get(`http://localhost:5000/api/products/${type}`);
            return response.data; // Retorna os produtos filtrados
        } catch (error) {
            console.error('Erro ao buscar produtos por tipo:', error);
            throw new Error('Erro ao buscar produtos por tipo: ' + error.message); // Re-lança o erro com mensagem
        }
    }
}

// Congela a instância para evitar modificações
const instance = new ProductFactory();
Object.freeze(instance);

export default instance;