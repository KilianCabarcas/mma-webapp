// src/components/SpecialtyList.js
import React, { useEffect, useState } from 'react';
import { firestore } from '../firebase';
import { collection, getDocs } from 'firebase/firestore';

// Componente SpecialtyList para mostrar y buscar especialidades médicas
const SpecialtyList = () => {
  // Estado para almacenar las especialidades
  const [specialties, setSpecialties] = useState([]);
  // Estado para almacenar el término de búsqueda
  const [filter, setFilter] = useState('');

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

  // Filtrar las especialidades según el término de búsqueda
  const filteredSpecialties = specialties.filter(specialty =>
    specialty.name.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div className="specialty-list">
      <h2>Especialidades Médicas</h2>
      <input
        type="text"
        className="form-control"
        placeholder="Buscar por especialidad o médico"
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
      />
      <ul className="list-group mt-3">
        {filteredSpecialties.map(specialty => (
          <li key={specialty.id} className="list-group-item">
            {specialty.name}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SpecialtyList;