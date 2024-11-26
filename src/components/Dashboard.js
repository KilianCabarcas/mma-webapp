// src/components/Dashboard.js
import React from 'react';
import { Link } from 'react-router-dom';
import { auth, firestore } from '../firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useDocument } from 'react-firebase-hooks/firestore';
import { doc } from 'firebase/firestore';

const Dashboard = () => {
  const [user] = useAuthState(auth);
  const [userDoc] = useDocument(user ? doc(firestore, 'users', user.uid) : null);

  return (
    <div className="dashboard">
      <h2>Dashboard</h2>
      <p>Bienvenido al sistema de gestión de citas médicas.</p>
      {userDoc && userDoc.exists() && userDoc.data().role === 'admin' && (
        <p>Como administrador, puedes gestionar las citas y especialidades médicas.</p>
      )}
      <ul>
        {userDoc && userDoc.exists() && userDoc.data().role === 'admin' && (
          <>
            <li><Link to="/new-appointment">Registrar Nueva Cita</Link></li>
            <li><Link to="/admin-appointments">Administrar Citas</Link></li>
          </>
        )}
        {userDoc && userDoc.exists() && userDoc.data().role === 'user' && (
          <>
            <li><Link to="/appointments">Mis Citas</Link></li>
            <li><Link to="/available-appointments">Registrar Cita</Link></li>
          </>
        )}
      </ul>
    </div>
  );
};

export default Dashboard;