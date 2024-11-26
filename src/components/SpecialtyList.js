// src/components/SpecialtyList.js
import React, { useEffect, useState } from 'react';
import { firestore } from '../firebase';
import { collection, getDocs } from 'firebase/firestore';

const SpecialtyList = () => {
  const [specialties, setSpecialties] = useState([]);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    const fetchSpecialties = async () => {
      const querySnapshot = await getDocs(collection(firestore, 'specialties'));
      const specialtiesData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setSpecialties(specialtiesData);
    };

    fetchSpecialties();
  }, []);

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