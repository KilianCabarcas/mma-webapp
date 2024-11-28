// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './components/Home';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import Admin from './components/Admin';
import AppointmentForm from './components/AppointmentForm';
import AppointmentList from './components/AppointmentList';
import AvailableAppointments from './components/AvailableAppointments';
import AdminAppointmentList from './components/AdminAppointmentList';
import PrivateRoute from './components/PrivateRoute';

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <div className="container mt-3">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard" element={<PrivateRoute role="user" />}>
              <Route path="/dashboard" element={<Dashboard />} />
            </Route>
            <Route path="/admin" element={<PrivateRoute role="admin" />}>
              <Route path="/admin" element={<Admin />} />
            </Route>
            <Route path="/appointments" element={<PrivateRoute role="user" />}>
              <Route path="/appointments" element={<AppointmentList />} />
            </Route>
            <Route path="/new-appointment" element={<PrivateRoute role="admin" />}>
              <Route path="/new-appointment" element={<AppointmentForm />} />
            </Route>
            <Route path="/available-appointments" element={<PrivateRoute role="user" />}>
              <Route path="/available-appointments" element={<AvailableAppointments />} />
            </Route>
            <Route path="/admin-appointments" element={<PrivateRoute role="admin" />}>
              <Route path="/admin-appointments" element={<AdminAppointmentList />} />
            </Route>
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;