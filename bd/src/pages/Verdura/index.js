// src/page/verduras.js
import React, { useEffect, useState } from 'react';
import { fetchVerduras } from '../../api'; // Importa a função para buscar Verduras
import { Link } from 'react-router-dom';

function Verduras() {
    const [verduras, setVerduras] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadVerduras = async () => {
            try {
                const data = await fetchVerduras(); // Chama a função para buscar Verduras
                // Verifica se a resposta contém um array de verduras
                if (Array.isArray(data.products)) {
                    setVerduras(data.products);
                } else {
                    throw new Error('Dados inválidos recebidos da API');
                }
            } catch (err) {
                console.error('Erro ao buscar Verduras:', err);
                setError('Não foi possível carregar as Verduras. Tente novamente mais tarde.');
            } finally {
                setLoading(false);
            }
        };

        loadVerduras(); // Executa a função para buscar Verduras
    }, []);

    if (loading) return <p>Carregando Verduras...</p>;
    if (error) return <p>{error}</p>;

    return (
        <main className="row produto-page">
            <div className="col-12">
                <h1>Verduras</h1>
                <div className="row">
                    {verduras.length === 0 ? (
                        <p>Nenhuma verdura disponível no momento.</p>
                    ) : (
                        verduras.map(verdura => (
                            <div key={verdura._id} className="produto-container-principal">
                                <div className="produto-principal">
                                    <Link to={`/products/${verdura._id}`} aria-label={`Ver detalhes do produto ${verdura.name}`}>
                                    <img 
                                        src={`http://localhost:5000/${verdura.imageUrl}`} 
                                        alt={verdura.name} 
                                        onError={(e) => { e.target.src = ''; }} 
                                    />
                                    </Link>
                                    <span>{verdura.name}</span>
                                    <span>
                                        R$ <span className="price">{verdura.price.toFixed(2)}</span> <span className="unit">{verdura.unit}</span>
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

export default Verduras;