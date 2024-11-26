// src/components/Admin.js
import React, { useState, useEffect } from 'react';
import { firestore } from '../firebase';
import { collection, getDocs, addDoc, deleteDoc, doc } from 'firebase/firestore';

const Admin = () => {
  const [specialties, setSpecialties] = useState([]);
  const [newSpecialty, setNewSpecialty] = useState('');

  useEffect(() => {
    const fetchSpecialties = async () => {
      const querySnapshot = await getDocs(collection(firestore, 'specialties'));
      const specialtiesData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setSpecialties(specialtiesData);
    };

    fetchSpecialties();
  }, []);

  const handleAddSpecialty = async (e) => {
    e.preventDefault();
    try {
      const docRef = await addDoc(collection(firestore, 'specialties'), { name: newSpecialty });
      setSpecialties([...specialties, { id: docRef.id, name: newSpecialty }]);
      setNewSpecialty('');
    } catch (error) {
      console.error('Error adding specialty: ', error);
    }
  };

  const handleDeleteSpecialty = async (id) => {
    try {
      await deleteDoc(doc(firestore, 'specialties', id));
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
          <input type="text" className="form-control" value={newSpecialty} onChange={(e) => setNewSpecialty(e.target.value)} required />
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