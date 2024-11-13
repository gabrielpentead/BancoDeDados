import { Routes, Route } from 'react-router-dom';

import Login from '../pages/Login';
import SignUp from '../pages/SignUp';
import Profile from '../pages/Profile';
import Home from "../pages/Home";
import Verdura from "../pages/Verdura";
import Fruta from "../pages/Fruta";
import Legume from "../pages/Legume";
import Hortalica from "../pages/Hortalica";
import Outro from "../pages/Outro";
import Paginapd from "../pages/Paginapd";
import SearchResults from '../pages/SearchResults';
import Private from './Private';
import Carrinho from '../pages/Carrinho';
import MySales from '../pages/MySales/MySales';  // Importe a nova página

function RoutesApp(){
  return(
    <Routes>
      <Route path="/home" element={<Private><Home /></Private>} />
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<SignUp />} />
      <Route path="/verdura" element={<Private><Verdura /></Private>} />
      <Route path="/fruta" element={<Private><Fruta /></Private>} />
      <Route path="/legume" element={<Private><Legume /></Private>} />
      <Route path="/hortalica" element={<Private><Hortalica /></Private>} />
      <Route path="/outro" element={<Private><Outro /></Private>} />
      <Route path="/products/:id" element={<Private><Paginapd /></Private>} />
      <Route path="/search/:query" element={<Private><SearchResults /></Private>} />
      <Route path="/profile" element={<Private><Profile /></Private>} />
      <Route path="/carrinho" element={<Private><Carrinho /></Private>} />
      <Route path="/minhas-vendas" element={<Private><MySales /></Private>} /> {/* Nova rota */}
    </Routes>
  )
}

export default RoutesApp;
