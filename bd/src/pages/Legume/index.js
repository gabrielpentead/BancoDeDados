// src/page/legume.js
import React, { useEffect, useState } from 'react';
import { fetchLegumes } from '../../api'; // Importa a função para buscar Legumes
import { Link } from 'react-router-dom';

function Legumes() {
    const [legumes, setLegumes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadLegumes = async () => {
            try {
                const data = await fetchLegumes(); // Chama a função para buscar Legumes
                // Verifica se a resposta contém um array de legumes
                if (Array.isArray(data.products)) {
                    setLegumes(data.products);
                } else {
                    throw new Error('Dados inválidos recebidos da API');
                }
            } catch (err) {
                console.error('Erro ao buscar Legumes:', err);
                setError('Não foi possível carregar os Legumes. Tente novamente mais tarde.');
            } finally {
                setLoading(false);
            }
        };

        loadLegumes(); // Executa a função para buscar Legumes
    }, []);

    if (loading) return <p>Carregando Legumes...</p>;
    if (error) return <p>{error}</p>;

    return (
        <main className="row produto-page">
            <div className="col-12">
                <h1>Legumes</h1>
                <div className="row">
                    {legumes.length === 0 ? (
                        <p>Nenhum legume disponível no momento.</p>
                    ) : (
                        legumes.map(legume => (
                            <div key={legume._id} className="produto-container-principal">
                                <div className="produto-principal">
                                    <Link to={`/products/${legume._id}`} aria-label={`Ver detalhes do produto ${legume.name}`}>
                                    <img 
                                        src={`http://localhost:5000/${legume.imageUrl}`} 
                                        alt={legume.name} 
                                        onError={(e) => { e.target.src = ''; }} 
                                    />
                                    </Link>
                                    <span>{legume.name}</span>
                                    <span>
                                        R$ <span className="price">{legume.price.toFixed(2)}</span> <span className="unit">{legume.unit}</span>
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

export default Legumes;