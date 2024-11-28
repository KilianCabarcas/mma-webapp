import React, { useState } from 'react';
import { auth } from '../firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import Swal from 'sweetalert2'; // Importa SweetAlert2

// Componente Login para manejar la autenticación de usuarios
const Login = () => {
  // Estados para almacenar el correo electrónico y la contraseña
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Función para manejar el envío del formulario de inicio de sesión
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Iniciar sesión con correo electrónico y contraseña utilizando Firebase Auth
      await signInWithEmailAndPassword(auth, email, password);
      // SweetAlert success message
      Swal.fire({
        icon: 'success',
        title: 'Inicio de sesión exitoso',
        text: 'Has iniciado sesión con éxito.',
        confirmButtonText: 'Aceptar',
      });
    } catch (error) {
      console.error('Error signing in: ', error);
      // SweetAlert error message
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Hubo un error al iniciar sesión. Por favor, verifica tus credenciales.',
        confirmButtonText: 'Aceptar',
      });
    }
  };

  return (
    <div className="login">
      <h2>Iniciar Sesión</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Correo Electrónico</label>
          <input
            type="email"
            className="form-control"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Contraseña</label>
          <input
            type="password"
            className="form-control"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary">Iniciar Sesión</button>
      </form>
    </div>
  );
};

export default Login;