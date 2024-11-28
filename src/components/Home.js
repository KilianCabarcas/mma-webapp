// src/components/Home.js
import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

// Componente Home para mostrar la página principal con la imagen del hospital y el botón de iniciar sesión
const Inicio = () => {
  return (
    <div className="contenedor-inicio">
      <div className="imagen-inicio">
        <img src="https://newsnetwork.mayoclinic.org/n7-mcnn/7bcc9724adf7b803/uploads/2016/05/AHD-NightShot-hres.jpg" alt="Hospital" />
      </div>
      <div className="contenido-inicio">
        <h1>Bienvenido al Centro Médico Universitario</h1>
        <p>
          Nuestro centro médico ofrece una amplia gama de servicios para estudiantes, profesores y personal administrativo. 
          Puedes reservar y gestionar tus citas médicas de manera fácil y rápida a través de nuestra plataforma.
        </p>
        <p>
          Por favor, inicia sesión o regístrate para acceder a nuestros servicios.
        </p>
        <Link to="/login" className="btn btn-primary btn-lg">Iniciar Sesión</Link>
      </div>
    </div>
  );
};

export default Inicio;