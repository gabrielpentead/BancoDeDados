import { useState, useContext } from 'react';
import './Login.css';
import logo from '../../assets/imagens/LogoFeiraGreen.png';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../contexts/auth';


export default function SignIn(){
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const { signIn, loadingAuth } = useContext(AuthContext)

  async function handleSignIn(e){
    e.preventDefault();

    if(email !== '' && password !== ''){
      await signIn(email, password);
    }

  }

  return (
    <div className="container-center"> 
      <div className="formulario-login"> 
        <div className="login">
          <div className="centralizar"> 
            <div className="img-container"> 
              <img src={logo} alt="Logo Feira Green" /> 
            </div>

            <form onSubmit={handleSignIn}> 
              <label htmlFor="username">
                <b>Email do usuário</b> 
              </label>
              <input
                type="text"
                placeholder="Insira o Email do usuário" 
                
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                
              />

              <label htmlFor="password">
                <b>Senha</b>
              </label>
              <input
                type="password"
                placeholder="Insira a senha"
                
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                
              />

              <button type="submit">
                {loadingAuth ? "Carregando..." : "Acessar"}
              </button>
            </form>

            <div className="links"> 
              <Link to="/register">Criar uma conta</Link> 
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}