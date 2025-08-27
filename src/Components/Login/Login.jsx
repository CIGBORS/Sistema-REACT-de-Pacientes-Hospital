import { useState, useEffect } from 'react';
import PropTypes from "prop-types";
function Login({ onLogin }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [accounts, setAccounts] = useState([]);

    useEffect(() => {
      fetch("/data.json")
        .then((res) => res.json())
        .then((json) => setAccounts(json));
    }, []);

    const validEmail = /\S+@\S+\.\S+/.test(email);
    const formValid = validEmail && password.length > 0;

    const handleSubmit = (event) => {
        event.preventDefault();
        if(formValid){
            const userExists = accounts.some(
                (acc) => acc.email === email && acc.senha === password
              );   
            if(userExists){
                onLogin()
            } else{
                alert("CONTA OU SENHA ERRADA")
            }
        }
    };



  return (
    <div className='container'>
        <form onSubmit={handleSubmit}>
            <h1>Login de Usuário</h1>
            <div>
                <input type="email" 
                placeholder='E-mail' 
                onChange={(e) => setEmail(e.target.value)} 
                />
            </div>
            <div>
                <input type="password" 
                placeholder= 'Senha'
                onChange={(e) => setPassword(e.target.value)} />
            </div>
            <button type="submit" disabled={!formValid}>
                Entrar
            </button>
        </form>
    </div>
  )
}
Login.propTypes = {
    onLogin: PropTypes.func.isRequired,
  };
export default Login
