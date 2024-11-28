// src/components/RutaPrivada.js
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { auth, firestore } from '../firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useDocument } from 'react-firebase-hooks/firestore';
import { doc } from 'firebase/firestore';

// Componente RutaPrivada para proteger rutas según el rol del usuario
const RutaPrivada = ({ rol }) => {
  const [usuario] = useAuthState(auth);
  const [usuarioDoc] = useDocument(usuario ? doc(firestore, 'usuarios', usuario.uid) : null);

  // Si no hay usuario autenticado, redirige a la página de login
  if (!usuario) {
    return <Navigate to="/login" />;
  }

  // Si el usuario tiene el rol requerido, renderiza el componente hijo
  if (usuarioDoc && usuarioDoc.exists() && usuarioDoc.data().rol === rol) {
    return <Outlet />;
  }

  // Si el usuario no tiene el rol requerido, redirige al dashboard
  return <Navigate to="/dashboard" />;
};

export default RutaPrivada;