import { useState, useEffect } from 'react';
import axios from 'axios';
import BannerCarousel from './BannerCarousel';
import PromocaoHeader from './PromocaoHeader';
import ProductList from './ProductList';
import './Home.css';

function Home() {
  const [promocao, setPromocao] = useState([]);
  const [index, setIndex] = useState(0);
  const [error, setError] = useState(null);
  
  const handleSearch = (selectedIndex) => {
    setIndex(selectedIndex);
  };

  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/products';
  
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(API_URL);
        const frutas = response.data.filter((product) => product.type === 'fruta');
        setPromocao(frutas);
      } catch (error) {
        console.error('Erro ao buscar produtos:', error);
        setError('Erro ao carregar produtos. Tente novamente mais tarde.');
      }
    };

    fetchProducts();
  }, []); 

  return (
    <div className="container-fluid">
      {error && <div className="error-message">{error}</div>} 
      <BannerCarousel activeIndex={index} onSelect={handleSearch} />
      <hr />
      <PromocaoHeader />
      <hr />
      <ProductList products={promocao} />
    </div>
  );
}

export default Home;