// src/page/outros.js
import React, { useEffect, useState } from 'react';
import { fetchOutros } from '../../api'; // Importa a função para buscar Outros produtos
import { Link } from 'react-router-dom';

function Outros() {
    const [outros, setOutros] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadOutros = async () => {
            try {
                const data = await fetchOutros(); // Chama a função para buscar Outros produtos
                // Verifica se a resposta contém um array de outros produtos
                if (Array.isArray(data.products)) {
                    setOutros(data.products);
                } else {
                    throw new Error('Dados inválidos recebidos da API');
                }
            } catch (err) {
                console.error('Erro ao buscar Outros produtos:', err);
                setError('Não foi possível carregar os Outros produtos. Tente novamente mais tarde.');
            } finally {
                setLoading(false);
            }
        };

        loadOutros(); // Executa a função para buscar Outros produtos
    }, []);

    if (loading) return <p>Carregando Outros produtos...</p>;
    if (error) return <p>{error}</p>;

    return (
        <main className="row produto-page">
            <div className="col-12">
                <h1>Outros Produtos</h1>
                <div className="row">
                    {outros.length === 0 ? (
                        <p>Nenhum outro produto disponível no momento.</p>
                    ) : (
                        outros.map(outro => (
                            <div key={outro._id} className="produto-container-principal">
                                <div className="produto-principal">
                                    <Link to={`/products/${outro._id}`} aria-label={`Ver detalhes do produto ${outro.name}`}>
                                    <img 
                                        src={`http://localhost:5000/${outro.imageUrl}`} 
                                        alt={outro.name} 
                                        onError={(e) => { e.target.src = ''; }} 
                                    />
                                    </Link>
                                    <span>{outro.name}</span>
                                    <span>
                                        R$ <span className="price">{outro.price.toFixed(2)}</span> <span className="unit">{outro.unit}</span>
                                    </span>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </main>
    );
}

export default Outros;