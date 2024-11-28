import React, { useEffect, useState } from 'react';
import { firestore, auth } from '../firebase';
import { collection, getDocs, updateDoc, doc, query, where } from 'firebase/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useDocument } from 'react-firebase-hooks/firestore';
import Swal from 'sweetalert2'; // Importa SweetAlert2

// Componente ListaCitas para mostrar las citas del usuario
const AppointmentList = () => {
  // Estado para almacenar las citas del usuario
  const [appointments, setAppointments] = useState([]);
  // Obtener el estado de autenticación del usuario
  const [user] = useAuthState(auth);
  // Obtener el documento del usuario desde Firestore
  const [userDoc] = useDocument(user ? doc(firestore, 'users', user.uid) : null);

  // useEffect para obtener las citas del usuario desde Firestore al cargar el componente
  useEffect(() => {
    if (userDoc && userDoc.exists() && userDoc.data().role === 'user') {
      const fetchAppointments = async () => {
        // Crear una consulta para obtener las citas del usuario autenticado
        const q = query(collection(firestore, 'appointments'), where('userId', '==', user.uid));
        // Obtener los documentos de la colección 'appointments' que cumplen con la consulta
        const querySnapshot = await getDocs(q);
        // Mapear los documentos a un array de objetos con id y datos
        const appointmentsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        // Actualizar el estado con las citas obtenidas
        setAppointments(appointmentsData);
      };

      fetchAppointments();
    }
  }, [user, userDoc]);

  // Función para manejar la cancelación de una cita
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
        // Actualizar el documento de la cita en Firestore para marcarla como cancelada
        const appointmentRef = doc(firestore, 'appointments', id);
        await updateDoc(appointmentRef, { status: 'cancelled' });
        // Actualizar el estado para reflejar la cancelación
        setAppointments(appointments.map(appointment =>
          appointment.id === id ? { ...appointment, status: 'cancelled' } : appointment
        ));
        // SweetAlert success message
        Swal.fire({
          icon: 'success',
          title: 'Cita cancelada',
          text: 'Tu cita médica ha sido cancelada con éxito.',
          confirmButtonText: 'Aceptar',
        });
      } catch (error) {
        console.error('Error cancelling appointment: ', error);
        // SweetAlert error message
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Hubo un error al cancelar tu cita médica.',
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
            <div>
              <strong>Especialidad:</strong> {appointment.specialty} <br />
              <strong>Doctor:</strong> {appointment.doctor} <br />
              <strong>Fecha:</strong> {appointment.date} <br />
              <strong>Hora:</strong> {appointment.time} <br />
              <strong>Descripción:</strong> {appointment.description} <br />
              <strong>Estado:</strong> {appointment.status}
            </div>
            {appointment.status !== 'cancelled' && (
              <button className="btn btn-danger mt-2" onClick={() => handleCancelAppointment(appointment.id)}>Cancelar</button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AppointmentList;