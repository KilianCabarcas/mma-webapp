// src/components/AvailableAppointments.js
import React, { useEffect, useState } from 'react';
import { firestore, auth } from '../firebase';
import { collection, getDocs, updateDoc, doc } from 'firebase/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useDocument } from 'react-firebase-hooks/firestore';

const AvailableAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [user] = useAuthState(auth);
  const [userDoc] = useDocument(user ? doc(firestore, 'users', user.uid) : null);

  useEffect(() => {
    const fetchAppointments = async () => {
      const querySnapshot = await getDocs(collection(firestore, 'appointments'));
      const appointmentsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setAppointments(appointmentsData.filter(appointment => appointment.availability === 'yes'));
      setFilteredAppointments(appointmentsData.filter(appointment => appointment.availability === 'yes'));
    };

    fetchAppointments();
  }, []);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    const filtered = appointments.filter(appointment =>
      appointment.specialty.toLowerCase().includes(e.target.value.toLowerCase()) ||
      appointment.doctor.toLowerCase().includes(e.target.value.toLowerCase())
    );
    setFilteredAppointments(filtered);
  };

  const handleTakeAppointment = async (id) => {
    if (userDoc && userDoc.exists() && userDoc.data().role === 'user') {
      try {
        const appointmentRef = doc(firestore, 'appointments', id);
        await updateDoc(appointmentRef, {
          availability: 'no',
          userId: user.uid
        });
        setAppointments(appointments.filter(appointment => appointment.id !== id));
        setFilteredAppointments(filteredAppointments.filter(appointment => appointment.id !== id));
      } catch (error) {
        console.error('Error taking appointment: ', error);
      }
    }
  };

  return (
    <div className="available-appointments">
      <h2>Registrar Cita</h2>
      <input
        type="text"
        className="form-control"
        placeholder="Buscar por especialidad o médico"
        value={searchTerm}
        onChange={handleSearch}
      />
      <ul className="list-group mt-3">
        {filteredAppointments.map(appointment => (
          <li key={appointment.id} className="list-group-item">
            <h5>{appointment.specialty}</h5>
            <p>Médico: {appointment.doctor}</p>
            <p>Fecha: {appointment.date}</p>
            <p>Hora: {appointment.time}</p>
            <p>Descripción: {appointment.description}</p>
            <button className="btn btn-primary" onClick={() => handleTakeAppointment(appointment.id)}>Tomar Cita</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AvailableAppointments;