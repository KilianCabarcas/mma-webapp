// src/components/PrivateRoute.js
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { auth, firestore } from '../firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useDocument } from 'react-firebase-hooks/firestore';
import { doc } from 'firebase/firestore';

const PrivateRoute = ({ role }) => {
  const [user] = useAuthState(auth);
  const [userDoc] = useDocument(user ? doc(firestore, 'users', user.uid) : null);

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (userDoc && userDoc.exists() && userDoc.data().role === role) {
    return <Outlet />;
  }

  return <Navigate to="/dashboard" />;
};

export default PrivateRoute;