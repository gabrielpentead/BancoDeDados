import { BrowserRouter } from 'react-router-dom'
import RoutesApp from './routes';
import 'bootstrap/dist/css/bootstrap.min.css';

import AuthProvider from './contexts/auth'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';

import  Header  from "./conponents/Header";
import  Footer  from "./conponents/Footer";

function App() {
  return (
    <BrowserRouter>
    <Header />
      <AuthProvider>
        <ToastContainer autoClose={3000} />
        <RoutesApp/>
      </AuthProvider>
      <Footer />
    </BrowserRouter>
  );
}

export default App;