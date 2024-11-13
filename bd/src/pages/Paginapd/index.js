import React, { useState, useEffect } from 'react';
import { Carousel } from 'react-bootstrap';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';

function Paginapd() {
  const { _id } = useParams();  // Pega o ID do produto na URL
  const productId = _id;  // Mantém o ID do produto
  const [produto, setProduto] = useState(null);  // Estado para o produto
  const [relatedProducts, setRelatedProducts] = useState([]);  // Estado para os produtos relacionados
  const [index, setIndex] = useState(0);  // Estado para controlar o índice do carousel
  const [loading, setLoading] = useState(true);  // Estado para controle de loading
  const [errorMessage, setErrorMessage] = useState(null);  // Estado para mensagens de erro

  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/products/';

  // Função para buscar dados do produto
  useEffect(() => {
    const fetchProductData = async () => {
      setLoading(true);
      setErrorMessage(null);
      try {
        // Requisição para obter os dados do produto específico
        const productResponse = await axios.get(`${API_URL}/${productId}`);
        setProduto(productResponse.data);

        // Requisição para buscar produtos relacionados
        const relatedResponse = await axios.get(`${API_URL}?type=${productResponse.data._id}`);
        setRelatedProducts(relatedResponse.data.filter(product => product._id !== productId)); // Exclui o produto atual
      } catch (error) {
        setErrorMessage(error.message);  // Exibe a mensagem de erro
        console.error('Erro ao buscar dados do produto:', error);
      } finally {
        setLoading(false);  // Termina o loading
      }
    };

    if (productId) {
      fetchProductData();
    }
  }, [productId]);

  // Função para controlar o índice do carousel
  const handleSelect = (selectedIndex) => {
    setIndex(selectedIndex);
  };

  // Função para adicionar um produto ao carrinho
  const addToCart = (product) => {
    const existingCart = getCartFromLocalStorage();
    existingCart.push(product);  // Adiciona o produto ao carrinho
    localStorage.setItem('cart', JSON.stringify(existingCart));  // Salva o carrinho no localStorage
    alert(`${product.name} foi adicionado ao carrinho!`);
  };

  // Função para obter o carrinho do localStorage
  const getCartFromLocalStorage = () => {
    const cart = localStorage.getItem('cart');
    return cart ? JSON.parse(cart) : [];  // Retorna o carrinho ou um array vazio
  };

  // Renderiza a tela enquanto os dados estão carregando
  if (loading) {
    return <div className="text-center">Carregando...</div>;
  }

  // Exibe mensagem de erro caso haja algum problema
  if (errorMessage) {
    return <div className="text-center text-danger">{errorMessage}</div>;
  }

  // Caso o produto não seja encontrado, exibe uma mensagem
  if (!produto) {
    return <div className="text-center">Produto não encontrado.</div>;
  }

  // Agrupa os produtos relacionados em grupos de 3 para o carousel
  const groupedProducts = [];
  for (let i = 0; i < relatedProducts.length; i += 3) {
    groupedProducts.push(relatedProducts.slice(i, i + 3));
  }

  return (
    <div className="container mt-4">
      <div className="row">
        <div className="col-md-6">
          <div className="image-box">
            {produto.imageUrl ? (
              <img src={`http://localhost:5000/${produto.imageUrl}`} alt={produto.name} className="img-fluid" />
            ) : (
              <div className="placeholder-image">Imagem não disponível</div>
            )}
          </div>
        </div>
        <div className="col-md-6">
          <div className="text-container">
            <h2 className="category">{produto.type}</h2>
            <h3 className="name">{produto.name}</h3>
            <div className="price-produto">R$ {produto.price} {produto.unit}</div>
            <hr />
            <div className="button-container">
              <button className="btn btn-primary">Comprar</button>
              <button className="btn btn-secondary" onClick={() => addToCart(produto)}>
                Adicionar ao Carrinho
              </button>
            </div>
          </div>
        </div>
      </div>
      <hr />
      <div className="text-center">
        <h3>Ou Compre Outros</h3>
      </div>
      <section className="related-products">
        <Carousel activeIndex={index} onSelect={handleSelect} indicators={false} controls={groupedProducts.length > 1}>
          {groupedProducts.length > 0 ? (
            groupedProducts.map((group, idx) => (
              <Carousel.Item key={idx}>
                <div className="d-flex justify-content-center">
                  {group.map((product) => (
                    <div key={product._id} className="produto-product mx-2 text-center">
                      <Link to={`/paginapd/${product._id}`}>
                        <img src={`http://localhost:5000/${product.imageUrl}`} alt={product.name} className="img-fluid" />
                      </Link>
                      <span>{product.name}</span>
                      <div>
                        R$ <span className="price">{product.price}</span>
                        {product.unit && <span className="unit"> / {product.unit}</span>}
                      </div>
                    </div>
                  ))}
                </div>
              </Carousel.Item>
            ))
          ) : (
            <Carousel.Item>
              <div className="d-flex justify-content-center">
                <span>Não há produtos relacionados disponíveis.</span>
              </div>
            </Carousel.Item>
          )}
        </Carousel>
      </section>
    </div>
  );
}

export default Paginapd;
