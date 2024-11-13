// src/page/Home/ProductList.js
import React from 'react';
import { Link } from 'react-router-dom';

const ProductList = ({ products }) => {
    if (!products || products.length === 0) {
        return <div>Nenhum produto disponível.</div>; // Mensagem caso não haja produtos
    }

    return (
        <main className="row produto-page">
            <div className="col-12">
                <div className="row">
                    {products.map((product) => (
                        <div key={product._id} className="produto-container-principal">
                            <div className="produto-principal">
                                <Link to={`/paginapd/${product._id}`} aria-label={`Ver detalhes do produto ${product.name}`}>
                                    <img 
                                        src={`http://localhost:5000/${product.imageUrl}`}
                                        alt={product.name} 
                                        className="img-fluid" 
                                        onError={(e) => { e.target.src = '/path/to/default/image.jpg'; }} // Ajuste o caminho para a imagem padrão
                                    />
                                </Link>
                                <span>{product.name}</span>
                                <span>
                                    R$ <span className="price">{product.price.toFixed(2)}</span> <span className="unit">{product.unit}</span>
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </main>
    );
};

export default ProductList;