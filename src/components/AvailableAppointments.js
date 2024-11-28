import React, { useEffect, useState } from 'react';
import { firestore, auth } from '../firebase';
import { collection, getDocs, updateDoc, doc } from 'firebase/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useDocument } from 'react-firebase-hooks/firestore';
import Swal from 'sweetalert2'; // Importa SweetAlert2

// Componente Citas Disponibles para mostrar y registrar citas disponibles
const AvailableAppointments = () => {
  // Estado para almacenar todas las citas disponibles
  const [appointments, setAppointments] = useState([]);
  // Estado para almacenar las citas filtradas según el término de búsqueda
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  // Estado para almacenar el término de búsqueda
  const [searchTerm, setSearchTerm] = useState('');
  // Obtener el estado de autenticación del usuario
  const [user] = useAuthState(auth);
  // Obtener el documento del usuario desde Firestore
  const [userDoc] = useDocument(user ? doc(firestore, 'users', user.uid) : null);

  // useEffect para obtener las citas disponibles desde Firestore al cargar el componente
  useEffect(() => {
    const fetchAppointments = async () => {
      // Obtener documentos de la colección 'appointments'
      const querySnapshot = await getDocs(collection(firestore, 'appointments'));
      // Mapear los documentos a un array de objetos con id y datos
      const appointmentsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      // Filtrar las citas disponibles y actualizar el estado
      setAppointments(appointmentsData.filter(appointment => appointment.availability === 'yes'));
      setFilteredAppointments(appointmentsData.filter(appointment => appointment.availability === 'yes'));
    };

    fetchAppointments();
  }, []);

  // Función para manejar la búsqueda de citas
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    // Filtrar las citas según el término de búsqueda
    const filtered = appointments.filter(appointment =>
      appointment.specialty.toLowerCase().includes(e.target.value.toLowerCase()) ||
      appointment.doctor.toLowerCase().includes(e.target.value.toLowerCase())
    );
    setFilteredAppointments(filtered);
  };

  // Función para manejar la toma de una cita disponible
  const handleTakeAppointment = async (id) => {
    if (userDoc && userDoc.exists() && userDoc.data().role === 'user') {
      try {
        // Actualizar el documento de la cita en Firestore para marcarla como tomada por el usuario
        const appointmentRef = doc(firestore, 'appointments', id);
        await updateDoc(appointmentRef, { availability: 'no', userId: user.uid });
        // Actualizar el estado para reflejar la toma de la cita
        setAppointments(appointments.filter(appointment => appointment.id !== id));
        setFilteredAppointments(filteredAppointments.filter(appointment => appointment.id !== id));
        // SweetAlert success message
        Swal.fire({
          icon: 'success',
          title: 'Cita tomada',
          text: 'Has tomado la cita médica con éxito.',
          confirmButtonText: 'Aceptar',
        });
      } catch (error) {
        console.error('Error taking appointment: ', error);
        // SweetAlert error message
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Hubo un error al tomar la cita médica.',
          confirmButtonText: 'Aceptar',
        });
      }
    }
  };

  return (
    <div className="available-appointments">
      <h2>Citas Médicas Disponibles</h2>
      <input
        type="text"
        placeholder="Buscar por especialidad o doctor"
        value={searchTerm}
        onChange={handleSearch}
        className="form-control mb-3"
      />
      <ul className="list-group">
        {filteredAppointments.map(appointment => (
          <li key={appointment.id} className="list-group-item">
            <div>
              <strong>Especialidad:</strong> {appointment.specialty} <br />
              <strong>Doctor:</strong> {appointment.doctor} <br />
              <strong>Fecha:</strong> {appointment.date} <br />
              <strong>Hora:</strong> {appointment.time} <br />
              <strong>Descripción:</strong> {appointment.description}
            </div>
            <button className="btn btn-primary mt-2" onClick={() => handleTakeAppointment(appointment.id)}>Tomar Cita</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AvailableAppointments;