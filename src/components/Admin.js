import React, { useState, useEffect } from 'react';
import { firestore } from '../firebase';
import { collection, getDocs, addDoc, deleteDoc, doc } from 'firebase/firestore';

// Componente Admin para gestionar especialidades médicas
const Admin = () => {
  // Estado para almacenar las especialidades
  const [specialties, setSpecialties] = useState([]);
  // Estado para almacenar la nueva especialidad a agregar
  const [newSpecialty, setNewSpecialty] = useState('');

  // useEffect para obtener las especialidades desde Firestore al cargar el componente
  useEffect(() => {
    const fetchSpecialties = async () => {
      // Obtener documentos de la colección 'specialties'
      const querySnapshot = await getDocs(collection(firestore, 'specialties'));
      // Mapear los documentos a un array de objetos con id y datos
      const specialtiesData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      // Actualizar el estado con las especialidades obtenidas
      setSpecialties(specialtiesData);
    };

    fetchSpecialties();
  }, []);

  // Función para manejar el envío del formulario y agregar una nueva especialidad
  const handleAddSpecialty = async (e) => {
    e.preventDefault();
    try {
      // Agregar un nuevo documento a la colección 'specialties'
      const docRef = await addDoc(collection(firestore, 'specialties'), { name: newSpecialty });
      // Actualizar el estado con la nueva especialidad agregada
      setSpecialties([...specialties, { id: docRef.id, name: newSpecialty }]);
      // Limpiar el campo de entrada
      setNewSpecialty('');
    } catch (error) {
      console.error('Error adding specialty: ', error);
    }
  };

  // Función para manejar la eliminación de una especialidad
  const handleDeleteSpecialty = async (id) => {
    try {
      // Eliminar el documento de la colección 'specialties'
      await deleteDoc(doc(firestore, 'specialties', id));
      // Actualizar el estado filtrando la especialidad eliminada
      setSpecialties(specialties.filter(specialty => specialty.id !== id));
    } catch (error) {
      console.error('Error deleting specialty: ', error);
    }
  };

  return (
    <div className="admin">
      <h2>Gestión de Especialidades Médicas</h2>
      <form onSubmit={handleAddSpecialty}>
        <div className="form-group">
          <label>Nueva Especialidad</label>
          <input
            type="text"
            className="form-control"
            value={newSpecialty}
            onChange={(e) => setNewSpecialty(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary">Agregar</button>
      </form>
      <ul className="list-group mt-3">
        {specialties.map(specialty => (
          <li key={specialty.id} className="list-group-item">
            {specialty.name}
            <button className="btn btn-danger float-right" onClick={() => handleDeleteSpecialty(specialty.id)}>Eliminar</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Admin;