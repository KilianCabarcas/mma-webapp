import React, { useEffect, useState } from 'react';
import { firestore, auth } from '../firebase';
import { collection, getDocs, updateDoc, doc, query, where } from 'firebase/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useDocument } from 'react-firebase-hooks/firestore';
import Swal from 'sweetalert2'; // Importa SweetAlert2


// Componente ListaCitas para mostrar las citas del usuario
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
    // SweetAlert confirmation dialog
    const result = await Swal.fire({
      title: '¿Estás seguro?',
      text: 'Esta acción cancelará tu cita médica.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, cancelar',
      cancelButtonText: 'No, volver',
      reverseButtons: true,
    });

    if (result.isConfirmed) {
      try {
        const appointmentRef = doc(firestore, 'appointments', id);
        await updateDoc(appointmentRef, {
          availability: 'yes',
          userId: null
        });
        setAppointments(appointments.filter(appointment => appointment.id !== id));

        // SweetAlert success message
        Swal.fire({
          icon: 'success',
          title: 'Cita cancelada',
          text: 'Tu cita médica ha sido cancelada con éxito.',
          confirmButtonText: 'Aceptar',
        });
      } catch (error) {
        console.error('Error canceling appointment: ', error);

        // SweetAlert error message
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudo cancelar la cita. Por favor, intenta nuevamente.',
          confirmButtonText: 'Aceptar',
        });
      }
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
            <button
              className="btn btn-danger"
              onClick={() => handleCancelAppointment(appointment.id)}
            >
              Cancelar
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AppointmentList;
