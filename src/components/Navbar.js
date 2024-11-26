// src/components/Navbar.js
import React from 'react';
import { Link } from 'react-router-dom';
import { auth, firestore } from '../firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useDocument } from 'react-firebase-hooks/firestore';
import { doc } from 'firebase/firestore';

const Navbar = () => {
  const [user] = useAuthState(auth);
  const [userDoc] = useDocument(user ? doc(firestore, 'users', user.uid) : null);

  const handleLogout = () => {
    auth.signOut();
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <Link className="navbar-brand" to="/">Centro Médico</Link>
      <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
        <span className="navbar-toggler-icon"></span>
      </button>
      <div className="collapse navbar-collapse" id="navbarNav">
        <ul className="navbar-nav mr-auto">
          {!user && (
            <>
              <li className="nav-item">
                <Link className="nav-link" to="/login">Login</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/register">Register</Link>
              </li>
            </>
          )}
          {user && (
            <>
              <li className="nav-item">
                <Link className="nav-link" to="/dashboard">Dashboard</Link>
              </li>
              {userDoc && userDoc.exists() && userDoc.data().role === 'admin' && (
                <>
                  <li className="nav-item">
                    <Link className="nav-link" to="/new-appointment">Crear Cita</Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link" to="/specialties">Especialidades</Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link" to="/admin-appointments">Administrar Citas</Link>
                  </li>
                </>
              )}
              {userDoc && userDoc.exists() && userDoc.data().role === 'user' && (
                <li className="nav-item">
                  <Link className="nav-link" to="/appointments">Mis Citas</Link>
                </li>
              )}
              <li className="nav-item">
                <button className="nav-link btn btn-link" onClick={handleLogout}>Logout</button>
              </li>
              <li className="nav-item">
                <span className="navbar-text">
                  {user.email} ({userDoc && userDoc.exists() && userDoc.data().role})
                </span>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;