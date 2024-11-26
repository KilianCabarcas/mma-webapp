// src/components/AdminAppointmentList.js
import React, { useEffect, useState } from 'react';
import { firestore } from '../firebase';
import { collection, getDocs, updateDoc, deleteDoc, doc } from 'firebase/firestore';

const AdminAppointmentList = () => {
  const [appointments, setAppointments] = useState([]);
  const [editingAppointment, setEditingAppointment] = useState(null);
  const [formData, setFormData] = useState({
    specialty: '',
    doctor: '',
    date: '',
    time: '',
    description: ''
  });

  useEffect(() => {
    const fetchAppointments = async () => {
      const querySnapshot = await getDocs(collection(firestore, 'appointments'));
      const appointmentsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setAppointments(appointmentsData);
    };

    fetchAppointments();
  }, []);

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
      setEditingAppointment(null);
      setFormData({
        specialty: '',
        doctor: '',
        date: '',
        time: '',
        description: ''
      });
    } catch (error) {
      console.error('Error updating appointment: ', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(firestore, 'appointments', id));
      setAppointments(appointments.filter(appointment => appointment.id !== id));
    } catch (error) {
      console.error('Error deleting appointment: ', error);
    }
  };

  return (
    <div className="admin-appointment-list">
      <h2>Gestión de Citas Médicas</h2>
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
        <ul className="list-group">
          {appointments.map(appointment => (
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