import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom'; // Importa o useLocation para capturar mudanças na URL
import ProductList from '../../pages/Home/ProductList'; // Importa a lista de produtos

function SearchResults() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredData, setFilteredData] = useState([]); // Estado para armazenar os produtos filtrados
  const location = useLocation(); // Captura a localização atual

  // Atualiza o searchQuery sempre que a URL mudar
  useEffect(() => {
    const query = location.pathname.split('/').pop(); // Pega a parte final do caminho da URL
    setSearchQuery(query); // Atualiza o estado com o novo termo de busca
  }, [location]);

  // Faz a busca no servidor quando o searchQuery mudar
  useEffect(() => {
    const fetchProducts = async () => {
      if (searchQuery) {
        try {
          const response = await fetch(`/api/products/search/${searchQuery}`);
          const data = await response.json();
          setFilteredData(data); // Atualiza o estado com os produtos filtrados
        } catch (error) {
          console.error('Erro ao buscar produtos:', error);
        }
      } else {
        setFilteredData([]); // Limpa os resultados se não houver consulta
      }
    };

    fetchProducts();
  }, [searchQuery]);

  return (
    <div className="container-carrinho">
      <div className="search-results-container">
        <h1>Resultados de busca para "{searchQuery}"</h1>
        {filteredData.length > 0 ? (
          <ProductList products={filteredData} /> // Usa ProductList para renderizar os produtos
        ) : (
          <p>Nenhum resultado encontrado para "{searchQuery}"</p>
        )}
      </div>
    </div>
  );
}

export default SearchResults;