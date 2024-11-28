// src/components/Login.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import Swal from 'sweetalert2'; // Importamos SweetAlert2
import './Login.css';

// Componente Login para manejar el inicio de sesión de los usuarios
const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      
      Swal.fire({
        title: '¡Inicio de sesión exitoso!',
        text: 'Redirigiendo al panel...',
        icon: 'success',
        timer: 2000, 
        showConfirmButton: false,
      });


      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);
    } catch (error) {

      Swal.fire({
        title: 'Error al iniciar sesión',
        text: error.message,
        icon: 'error',
        confirmButtonText: 'Intentar de nuevo',
      });
    }
  };

  return (
    <div className="login">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Email</label>
          <input 
            type="email" 
            className="form-control" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            required 
          />
        </div>
        <div className="form-group">
          <label>Password</label>
          <input 
            type="password" 
            className="form-control" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            required 
          />
        </div>
        <button type="submit" className="btn btn-primary">Login</button>
      </form>
    </div>
  );
};

export default Login;
