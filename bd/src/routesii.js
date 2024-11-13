import { BrowserRouter, Routes, Route } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';

import Home from "./pages/Home";
import Verdura from "./pages/Verdura";
import Fruta from "./pages/Fruta";
import Legume from "./pages/Legume";
import Hortalica from "./pages/Hortalica";
import Outro from "./pages/Outro";
import Paginapd from "./pages/Paginapd";
import Carrinho from "./pages/Carrinho";
import Login from "./pages/Login";
import Header from "./components/Header";
import Footer from "./components/Footer";
import SearchResults from './pages/SearchResults';
import MySales from './pages/MySales/MySales'; // Importe a nova página

function RoutesApp(){   
    return(
        <BrowserRouter>
            <Header />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/verdura" element={<Verdura />} />
                <Route path="/fruta" element={<Fruta />} />
                <Route path="/legume" element={<Legume />} />
                <Route path="/hortalica" element={<Hortalica />} />
                <Route path="/outro" element={<Outro />} />
                <Route path="/paginapd/:id" element={<Paginapd />} />
                <Route path="/carrinho" element={<Carrinho />} />
                <Route path="/login" element={<Login />} />
                <Route path="/search/:query" element={<SearchResults />} />
                <Route path="/minhas-vendas" element={<MySales />} /> {/* Nova rota */}
            </Routes>
            <Footer />
        </BrowserRouter>
    );
}

export default RoutesApp;
