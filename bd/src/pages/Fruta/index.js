// src/page/fruta.js
import React, { useEffect, useState } from 'react';
import { fetchFrutas } from '../../api'; // Importa a função para buscar frutas
import { Link } from 'react-router-dom';

function Fruta() {
    const [frutas, setFrutas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadFrutas = async () => {
            try {
                const data = await fetchFrutas(); // Chama a função para buscar frutas
                // Verifica se a resposta contém um array de frutas
                if (Array.isArray(data.products)) {
                    setFrutas(data.products);
                } else {
                    throw new Error('Dados inválidos recebidos da API');
                }
            } catch (err) {
                console.error('Erro ao buscar frutas:', err);
                setError('Não foi possível carregar as frutas. Tente novamente mais tarde.');
            } finally {
                setLoading(false);
            }
        };

        loadFrutas(); // Executa a função para buscar frutas
    }, []);

    if (loading) return <p>Carregando frutas...</p>;
    if (error) return <p>{error}</p>;

    return (
        <main className="row produto-page">
            <div className="col-12">
                <div className="row">
                    {frutas.map((fruta) => (
                        <div key={fruta._id} className="produto-container-principal">
                            <div className="produto-principal">
                            <Link to={`/products/${fruta._id}`} aria-label={`Ver detalhes do produto ${fruta.name}`}>
                            <img 
                                src={`http://localhost:5000/${fruta.imageUrl}`} 
                                alt={fruta.name} 
                                onError={(e) => { e.target.src = ''; }} 
                            />

                            </Link>
                                <span>{fruta.name}</span>
                                <span>
                                    R$ <span className="price">{fruta.price.toFixed(2)}</span> <span className="unit">{fruta.unit}</span>
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </main>
    );
}

export default Fruta;