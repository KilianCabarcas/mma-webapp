import React, { useEffect, useState } from 'react';
import { firestore } from '../firebase';
import { collection, getDocs, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import Swal from 'sweetalert2'; // Importa SweetAlert2

// Componente Lista Citas para que los administradores gestionen las citas
const AdminAppointmentList = () => {
  const [appointments, setAppointments] = useState([]);
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingAppointment, setEditingAppointment] = useState(null);
  const [formData, setFormData] = useState({
    specialty: '',
    doctor: '',
    date: '',
    time: '',
    description: ''
  });

  // useEffect para obtener las citas desde Firestore al cargar el componente
  useEffect(() => {
    const fetchAppointments = async () => {
      // Obtener documentos de la colección 'appointments'
      const querySnapshot = await getDocs(collection(firestore, 'appointments'));
      // Mapear los documentos a un array de objetos con id y datos
      const appointmentsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      // Actualizar el estado con las citas obtenidas
      setAppointments(appointmentsData);
      setFilteredAppointments(appointmentsData);
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

  const handleEdit = (appointment) => {
    setEditingAppointment(appointment.id);
    setFormData({
      specialty: appointment.specialty,
      doctor: appointment.doctor,
      date: appointment.date,
      time: appointment.time,
      description: appointment.description
    });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const appointmentRef = doc(firestore, 'appointments', editingAppointment);
      await updateDoc(appointmentRef, formData);
      setAppointments(appointments.map(appointment =>
        appointment.id === editingAppointment ? { ...appointment, ...formData } : appointment
      ));
      setFilteredAppointments(filteredAppointments.map(appointment =>
        appointment.id === editingAppointment ? { ...appointment, ...formData } : appointment
      ));
      setEditingAppointment(null);
      setFormData({
        specialty: '',
        doctor: '',
        date: '',
        time: '',
        description: ''
      });

      // SweetAlert success message
      Swal.fire({
        icon: 'success',
        title: 'Cita actualizada',
        text: 'La cita médica se ha actualizado con éxito.',
        confirmButtonText: 'Aceptar',
      });
    } catch (error) {
      console.error('Error updating appointment: ', error);

      // SweetAlert error message
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Hubo un problema al actualizar la cita. Por favor, inténtelo de nuevo.',
        confirmButtonText: 'Aceptar',
      });
    }
  };

  const handleDelete = async (id) => {
    // SweetAlert confirmation dialog
    const result = await Swal.fire({
      title: '¿Estás seguro?',
      text: 'Esta acción eliminará la cita médica de forma permanente.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'No, cancelar',
      reverseButtons: true,
    });

    if (result.isConfirmed) {
      try {
        await deleteDoc(doc(firestore, 'appointments', id));
        setAppointments(appointments.filter(appointment => appointment.id !== id));
        setFilteredAppointments(filteredAppointments.filter(appointment => appointment.id !== id));

        // SweetAlert success message
        Swal.fire({
          icon: 'success',
          title: 'Cita eliminada',
          text: 'La cita médica ha sido eliminada con éxito.',
          confirmButtonText: 'Aceptar',
        });
      } catch (error) {
        console.error('Error deleting appointment: ', error);

        // SweetAlert error message
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudo eliminar la cita. Por favor, inténtelo de nuevo.',
          confirmButtonText: 'Aceptar',
        });
      }
    }
  };

  return (
    <div className="admin-appointment-list">
      <h2>Gestión de Citas Médicas</h2>
      <input
        type="text"
        className="form-control"
        placeholder="Buscar por especialidad o médico"
        value={searchTerm}
        onChange={handleSearch}
      />
      {editingAppointment ? (
        <form onSubmit={handleUpdate}>
          <div className="form-group">
            <label>Especialidad</label>
            <input
              type="text"
              className="form-control"
              value={formData.specialty}
              onChange={(e) => setFormData({ ...formData, specialty: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label>Médico</label>
            <input
              type="text"
              className="form-control"
              value={formData.doctor}
              onChange={(e) => setFormData({ ...formData, doctor: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label>Fecha</label>
            <input
              type="date"
              className="form-control"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label>Hora</label>
            <input
              type="time"
              className="form-control"
              value={formData.time}
              onChange={(e) => setFormData({ ...formData, time: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label>Descripción</label>
            <textarea
              className="form-control"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              required
            ></textarea>
          </div>
          <button type="submit" className="btn btn-primary">Actualizar</button>
          <button type="button" className="btn btn-secondary" onClick={() => setEditingAppointment(null)}>Cancelar</button>
        </form>
      ) : (
        <ul className="list-group mt-3">
          {filteredAppointments.map(appointment => (
            <li key={appointment.id} className="list-group-item">
              <h5>{appointment.specialty}</h5>
              <p>Médico: {appointment.doctor}</p>
              <p>Fecha: {appointment.date}</p>
              <p>Hora: {appointment.time}</p>
              <p>Descripción: {appointment.description}</p>
              <button className="btn btn-warning" onClick={() => handleEdit(appointment)}>Editar</button>
              <button className="btn btn-danger" onClick={() => handleDelete(appointment.id)}>Eliminar</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AdminAppointmentList;
