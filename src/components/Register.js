// src/components/Register.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, firestore } from '../firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import Swal from 'sweetalert2'; // Importamos SweetAlert2
import './Register.css';


// Componente Register para manejar el registro de nuevos usuarios
const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user'); // Default role is 'user'
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Crear el usuario con Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Guardar el rol del usuario en Firestore
      await setDoc(doc(firestore, 'users', user.uid), {
        email,
        role,
      });

      // Mostrar alerta de éxito
      Swal.fire({
        title: '¡Registro exitoso!',
        text: 'Usuario registrado correctamente.',
        icon: 'success',
        timer: 2000,
        showConfirmButton: false,
      });


      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);
    } catch (error) {
      // Mostrar alerta de error
      Swal.fire({
        title: 'Error al registrar',
        text: error.message,
        icon: 'error',
        confirmButtonText: 'Intentar de nuevo',
      });
      console.error("Error registering: ", error);
    }
  };

  return (
    <div className="register">
      <h2>Register</h2>
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
        <div className="form-group">
          <label>Role</label>
          <select 
            className="form-control" 
            value={role} 
            onChange={(e) => setRole(e.target.value)} 
            required
          >
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
        </div>
        <button type="submit" className="btn btn-primary">Register</button>
      </form>
    </div>
  );
};

export default Register;
