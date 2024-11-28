// src/components/AppointmentForm.js
import React, { useState, useEffect } from 'react';
import { firestore } from '../firebase';
import { collection, addDoc, getDocs } from 'firebase/firestore';


// Componente FormularioCita para registrar nuevas citas médicas
const AppointmentForm = () => {
  const [specialty, setSpecialty] = useState('');
  const [doctor, setDoctor] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [description, setDescription] = useState('');
  const [specialties, setSpecialties] = useState([]);

  // Especialidades predefinidas
  const predefinedSpecialties = [
    'Odontología',
    'Valoración general',
    'Cardiología',
    'Dermatología',
    'Pediatría'
  ];

  useEffect(() => {
    const fetchSpecialties = async () => {
      const querySnapshot = await getDocs(collection(firestore, 'specialties'));
      const specialtiesData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setSpecialties([...predefinedSpecialties, ...specialtiesData.map(s => s.name)]);
    };

    fetchSpecialties();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addDoc(collection(firestore, 'appointments'), {
        specialty,
        doctor,
        date,
        time,
        description,
        availability: 'yes' // Establecer disponibilidad a 'sí' al crear una nueva cita
      });
      setSpecialty('');
      setDoctor('');
      setDate('');
      setTime('');
      setDescription('');
    } catch (error) {
      console.error('Error adding appointment: ', error);
    }
  };

  return (
    <div className="appointment-form">
      <h2>Registrar Cita Médica</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Especialidad</label>
          <select className="form-control" value={specialty} onChange={(e) => setSpecialty(e.target.value)} required>
            <option value="">Seleccione una especialidad</option>
            {specialties.map((specialty, index) => (
              <option key={index} value={specialty}>{specialty}</option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label>Médico</label>
          <input type="text" className="form-control" value={doctor} onChange={(e) => setDoctor(e.target.value)} required />
        </div>
        <div className="form-group">
          <label>Fecha</label>
          <input type="date" className="form-control" value={date} onChange={(e) => setDate(e.target.value)} required />
        </div>
        <div className="form-group">
          <label>Hora</label>
          <input type="time" className="form-control" value={time} onChange={(e) => setTime(e.target.value)} required />
        </div>
        <div className="form-group">
          <label>Descripción</label>
          <textarea className="form-control" value={description} onChange={(e) => setDescription(e.target.value)} required></textarea>
        </div>
        <button type="submit" className="btn btn-primary">Registrar</button>
      </form>
    </div>
  );
};

export default AppointmentForm;