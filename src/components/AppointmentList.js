// src/components/AppointmentList.js
import React, { useEffect, useState } from 'react';
import { firestore, auth } from '../firebase';
import { collection, getDocs, updateDoc, doc, query, where } from 'firebase/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useDocument } from 'react-firebase-hooks/firestore';

const AppointmentList = () => {
  const [appointments, setAppointments] = useState([]);
  const [user] = useAuthState(auth);
  const [userDoc] = useDocument(user ? doc(firestore, 'users', user.uid) : null);

  useEffect(() => {
    if (userDoc && userDoc.exists() && userDoc.data().role === 'user') {
      const fetchAppointments = async () => {
        const q = query(collection(firestore, 'appointments'), where('userId', '==', user.uid));
        const querySnapshot = await getDocs(q);
        const appointmentsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setAppointments(appointmentsData);
      };

      fetchAppointments();
    }
  }, [user, userDoc]);

  const handleCancelAppointment = async (id) => {
    try {
      const appointmentRef = doc(firestore, 'appointments', id);
      await updateDoc(appointmentRef, {
        availability: 'yes',
        userId: null
      });
      setAppointments(appointments.filter(appointment => appointment.id !== id));
    } catch (error) {
      console.error('Error canceling appointment: ', error);
    }
  };

  return (
    <div className="appointment-list">
      <h2>Mis Citas Médicas</h2>
      <ul className="list-group">
        {appointments.map(appointment => (
          <li key={appointment.id} className="list-group-item">
            <h5>{appointment.specialty}</h5>
            <p>Médico: {appointment.doctor}</p>
            <p>Fecha: {appointment.date}</p>
            <p>Hora: {appointment.time}</p>
            <p>Descripción: {appointment.description}</p>
            <button className="btn btn-danger" onClick={() => handleCancelAppointment(appointment.id)}>Cancelar</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AppointmentList;