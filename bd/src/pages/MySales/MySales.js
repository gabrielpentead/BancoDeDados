import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import { getAuth } from 'firebase/auth';
import { AuthContext } from '../../contexts/auth';

function ProductManagement() {
    const { user } = useContext(AuthContext);
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [unit, setUnit] = useState('');
    const [type, setType] = useState('');
    const [products, setProducts] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const [currentProductId, setCurrentProductId] = useState(null);
    const [loading, setLoading] = useState(false);
    const [userEmail, setUserEmail] = useState(user?.email || '');

    useEffect(() => {
        if (user) {
            setUserEmail(user.email);
        }
        loadProducts();
    }, [user]);

    const getAuthToken = async () => {
        const auth = getAuth();
        const currentUser = auth.currentUser;
        if (currentUser) {
            return await currentUser.getIdToken();
        }
        throw new Error('Usuário não autenticado');
    };

    const loadProducts = async () => {
        setLoading(true);
        try {
            const response = await axios.get('http://localhost:5000/api/products');
            const filteredProducts = response.data.filter(product => product.userEmail === userEmail);
            setProducts(filteredProducts);
        } catch (error) {
            console.error('Erro ao carregar produtos:', error);
            toast.error('Erro ao carregar produtos.');
        } finally {
            setLoading(false);
        }
    };

    const validateForm = () => {
        if (!imageFile) {
            toast.error('Selecione uma imagem para enviar.');
            return false;
        }
        if (!name) {
            toast.error('O nome do produto é obrigatório.');
            return false;
        }
        if (price <= 0 || isNaN(price)) {
            toast.error('O preço deve ser um número positivo.');
            return false;
        }
        if (!unit) {
            toast.error('Selecione uma unidade.');
            return false;
        }
        if (!type) {
            toast.error('Selecione um tipo de produto.');
            return false;
        }
        return true;
    };

    const addProduct = async () => {
        if (!validateForm()) {
            return;
        }

        const formData = new FormData();
        formData.append('name', name);
        formData.append('price', price);
        formData.append('type', type);
        formData.append('userEmail', userEmail);
        if (imageFile) {
            formData.append('image', imageFile);
        }

        try {
            const token = await getAuthToken();
            const response = await axios.post('http://localhost:5000/api/products', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${token}`,
                },
            });
            console.log('Produto adicionado com sucesso:', response.data);
            toast.success('Produto adicionado com sucesso!');
            resetForm();
            loadProducts();
        } catch (error) {
            console.error('Erro ao adicionar o produto:', error.response?.data || error);
            toast.error('Erro ao adicionar o produto. Tente novamente mais tarde.');
        }
    };

    const editProduct = (productId) => {
        const productToEdit = products.find(product => product._id === productId);
        if (productToEdit && productToEdit.userEmail === userEmail) {
            setImageFile(null);
            setImagePreview(null);
            setName(productToEdit.name);
            setPrice(productToEdit.price);
            setUnit(productToEdit.unit);
            setType(productToEdit.type);
            setCurrentProductId(productId);
            setIsEditing(true);
        } else {
            toast.error('Você não tem permissão para editar este produto.');
        }
    };

    const updateProduct = async () => {
        if (!validateForm()) return;

        const formData = new FormData();
        if (imageFile) {
            formData.append('image', imageFile);
        }
        formData.append('name', name);
        formData.append('price', price);
        formData.append('type', type);
        formData.append('userEmail', userEmail);

        try {
            const token = await getAuthToken();
            await axios.put(`http://localhost:5000/api/products/${currentProductId}`, formData, {
              headers: {
                'Content-Type': 'multipart/form-data',
                'Authorization': `Bearer ${token}`,
              },
            });
            toast.success('Produto editado com sucesso!');
            resetForm();
            loadProducts();
          } catch (error) {
            console.error('Erro ao editar o produto:', error.response?.data || error.message);
            toast.error('Erro ao editar o produto. Tente novamente mais tarde.');
          }
    };

    const deleteProduct = async (productId) => {
        const productToDelete = products.find(product => product._id === productId);
        if (productToDelete && productToDelete.userEmail === userEmail) {
            try {
                const token = await getAuthToken();
                await axios.delete(`http://localhost:5000/api/products/${productId}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });
                toast.success('Produto excluído com sucesso!');
                loadProducts();
            } catch (error) {
                console.error('Erro ao excluir o produto:', error);
                toast.error('Erro ao excluir o produto. Tente novamente mais tarde.');
            }
        } else {
            toast.error('Você não tem permissão para excluir este produto.');
        }
    };

    const resetForm = () => {
        setImageFile(null);
        setImagePreview(null);
        setName('');
        setPrice('');
        setUnit('');
        setType('');
        setIsEditing(false);
        setCurrentProductId(null);
    };

    return (
        <div className="container">
            <h1>Gestão de produtos</h1>
            <form>
                <div className="row">
                    <h2>{isEditing ? 'Editar produto' : 'Novo produto'}</h2>
                    <label htmlFor="image">Imagem:</label>
                    <div className="produto-principal">
                        <input
                            type="file"
                            id="image"
                            accept="image/*"
                            onChange={(e) => {
                                setImageFile(e.target.files[0]);
                                setImagePreview(URL.createObjectURL(e.target.files[0]));
                            }}
                        />
                        {imagePreview && <img src={imagePreview} alt="Preview" className="img-preview" />}
                    </div>
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
                        <option value="fruta">Fruta</option>
                        <option value="verdura">Verdura</option>
                        <option value="hortalica">Hortaliça</option>
                        <option value="legumes">Legumes</option>
                        <option value="outros">Outros</option>
                    </select>
                    <button type="button" onClick={isEditing ? updateProduct : addProduct}>
                        {isEditing ? 'Atualizar produto' : 'Adicionar produto'}
                    </button>
                    <input type="text" value={userEmail} disabled={true} />
                </div>
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
                                    <Link to={`/products/${product._id}`}>
                                        <img
                                            src={`http://localhost:5000/${product.imageUrl}`}
                                            alt={product.name}
                                            onError={(e) => (e.target.src = '')}
                                        />
                                    </Link>
                                    <span>{product.name}</span>
                                    <span>
                                        R$ <span className="price">{product.price}</span>{' '}
                                        <span className="unit">{product.unit}</span>
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
