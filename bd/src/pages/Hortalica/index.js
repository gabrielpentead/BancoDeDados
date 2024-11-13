// src/page/hortalicas.js
import React, { useEffect, useState } from 'react';
import { fetchHortalica } from '../../api'; // Importa a função para buscar Hortalicas
import { Link } from 'react-router-dom';

function Hortalicas() {
    const [hortalicas, setHortalicas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadHortalicas = async () => {
            try {
                const data = await fetchHortalica(); // Chama a função para buscar Hortalicas
                // Verifica se a resposta contém um array de hortalicas
                if (Array.isArray(data.products)) {
                    setHortalicas(data.products);
                } else {
                    throw new Error('Dados inválidos recebidos da API');
                }
            } catch (err) {
                console.error('Erro ao buscar Hortalicas:', err);
                setError('Não foi possível carregar as Hortalicas. Tente novamente mais tarde.');
            } finally {
                setLoading(false);
            }
        };

        loadHortalicas(); // Executa a função para buscar Hortalicas
    }, []);

    if (loading) return <p>Carregando Hortalicas...</p>;
    if (error) return <p>{error}</p>;

    return (
        <main className="row produto-page">
            <div className="col-12">
                <h1>Hortalicas</h1>
                <div className="row">
                    {hortalicas.length === 0 ? (
                        <p>Nenhuma hortalica disponível no momento.</p>
                    ) : (
                        hortalicas.map(hortalica => (
                            <div key={hortalica._id} className="produto-container-principal">
                                <div className="produto-principal">
                                    <Link to={`/products/${hortalica._id}`} aria-label={`Ver detalhes do produto ${hortalica.name}`}>
                                    <img 
                                        src={`http://localhost:5000/${hortalica.imageUrl}`} 
                                        alt={hortalica.name} 
                                        onError={(e) => { e.target.src = ''; }} 
                                    />
                                    </Link>
                                    <span>{hortalica.name}</span>
                                    <span>
                                        R$ <span className="price">{hortalica.price.toFixed(2)}</span> <span className="unit">{hortalica.unit}</span>
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

export default Hortalicas;