import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';

function ProductManagement() {
  const [imageFile, setImageFile] = useState(null);
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [unit, setUnit] = useState('');
  const [type, setType] = useState('');
  const [products, setProducts] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [currentProductId, setCurrentProductId] = useState(null);
  const [loading, setLoading] = useState(false); // Para controle de loading

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:5000/api/products');
      setProducts(response.data);
    } catch (error) {
      console.error('Erro ao carregar produtos:', error);
      toast.error('Erro ao carregar produtos.');
    } finally {
      setLoading(false);
    }
  };

  const addProduct = async () => {
    if (!imageFile) {
      toast.error('Selecione uma imagem para enviar.');
      return;
    }
    if (!name) {
      toast.error('O nome do produto é obrigatório.');
      return;
    }
    if (price <= 0) {
      toast.error('O preço deve ser um número positivo.');
      return;
    }
    if (!unit) {
      toast.error('Selecione uma unidade.');
      return;
    }
    if (!type) {
      toast.error('Selecione um tipo de produto.');
      return;
    }

    const formData = new FormData();
    formData.append('image', imageFile);
    formData.append('name', name);
    formData.append('price', price);
    formData.append('unit', unit);
    formData.append('type', type);

    try {
      await axios.post('http://localhost:5000/api/products', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      toast.success('Produto adicionado com sucesso!');
      resetForm();
      loadProducts();
    } catch (error) {
      console.error('Erro ao adicionar o produto:', error);
      toast.error('Erro ao adicionar o produto. Verifique o console para mais detalhes.');
    }
  };

  const editProduct = async (productId) => {
    const productToEdit = products.find(product => product._id === productId);
    if (productToEdit) {
      setImageFile(null); // Não vamos mudar a imagem se não for necessário
      setName(productToEdit.name);
      setPrice(productToEdit.price);
      setUnit(productToEdit.unit);
      setType(productToEdit.type);
      setCurrentProductId(productId);
      setIsEditing(true);
    }
  };

  const updateProduct = async () => {
    const formData = new FormData();
    if (imageFile) {
      formData.append('image', imageFile);
    }
    formData.append('name', name);
    formData.append('price', price);
    formData.append('unit', unit);
    formData.append('type', type);

    try {
      await axios.put(`http://localhost:5000/api/products/${currentProductId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      toast.success('Produto editado com sucesso!');
      resetForm();
      loadProducts();
    } catch (error) {
      console.error('Erro ao editar o produto:', error);
      toast.error('Erro ao editar o produto. Tente novamente mais tarde.');
    }
  };

  const deleteProduct = async (productId) => {
    try {
      await axios.delete(`http://localhost:5000/api/products/${productId}`);
      toast.success('Produto excluído com sucesso!');
      loadProducts();
    } catch (error) {
      console.error('Erro ao excluir o produto:', error);
      toast.error('Erro ao excluir o produto.');
    }
  };

  const resetForm = () => {
    setImageFile(null);
    setName('');
    setPrice('');
    setUnit('');
    setType('');
    setIsEditing(false);
    setCurrentProductId(null);
  };

  return (
    <div className="container">
      <form>
        <h1>Gestão de produtos</ h1>
        <h2>{isEditing ? 'Editar produto' : 'Novo produto'}</h2>
        <label htmlFor="image">Imagem:</label>
        <input
          type="file"
          id="image"
          accept="image/*"
          onChange={(e) => setImageFile(e.target.files[0])}
        />
        <label htmlFor="name">Nome do produto:</label>
        <input
          type="text"
          id="name"
          placeholder="produto"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <label htmlFor="price">Valor:</label>
        <input
          type="number"
          id="price"
          placeholder="valor"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />
        <label htmlFor="unit">Unidade:</label>
        <select id="unit" value={unit} onChange={(e) => setUnit(e.target.value)}>
          <option value="">Selecione a unidade</option>
          <option value="Kg">Kg</option>
          <option value="Unidade">Unidade</option>
        </select>
        <label htmlFor="type">Tipo:</label>
        <select id="type" value={type} onChange={(e) => setType(e.target.value)}>
          <option value="">Selecione o tipo</option>
          <option value="fruta">fruta</option>
          <option value="verdura">verdura</option>
          <option value="hortalica">hortalica</option>
          <option value="legumes">legumes</option>
          <option value="outros">outros</option>
        </select>
        <button type="button" onClick={isEditing ? updateProduct : addProduct}>
          {isEditing ? 'Atualizar produto' : 'Adicionar produto'}
        </button>
      </form>
      {loading ? (
        <p>Carregando produtos...</p>
      ) : (
        <div>
          <h2>Produtos cadastrados</h2>
          <div className="row">
            {products.map((product) => (
              <div key={product._id} className="produto-container-principal">
                <div className="produto-principal">
                  <Link to={`/paginapd/${product._id}`}>
                    <img src={product.image} alt={product.name} className="img-fluid" />
                  </Link>
                  <span>{product.name}</span>
                  <span>
                    R$ <span className="price">{product.price}</span> <span className="unit">{product.unit}</span>
                  </span>
                  <button type="button" onClick={() => editProduct(product._id)}>
                    Editar
                  </button>
                  <button type="button" onClick={() => deleteProduct(product._id)}>
                    Excluir
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default ProductManagement;