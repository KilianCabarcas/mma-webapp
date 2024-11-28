import React, { useState, useEffect } from 'react';
import { firestore } from '../firebase';
import { collection, getDocs, addDoc } from 'firebase/firestore';
import Swal from 'sweetalert2'; // Importa SweetAlert2

// Componente FormularioCita para registrar nuevas citas médicas
const AppointmentForm = () => {
  // Estados para almacenar los valores del formulario
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

  // useEffect para obtener las especialidades desde Firestore al cargar el componente
  useEffect(() => {
    const fetchSpecialties = async () => {
      // Obtener documentos de la colección 'specialties'
      const querySnapshot = await getDocs(collection(firestore, 'specialties'));
      // Mapear los documentos a un array de nombres de especialidades
      const specialtiesData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      // Actualizar el estado con las especialidades predefinidas y obtenidas
      setSpecialties([...predefinedSpecialties, ...specialtiesData.map(s => s.name)]);
    };

    fetchSpecialties();
  }, []);

  // Función para manejar el envío del formulario y agregar una nueva cita
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Agregar un nuevo documento a la colección 'appointments'
      await addDoc(collection(firestore, 'appointments'), {
        specialty,
        doctor,
        date,
        time,
        description,
        availability: 'yes' // Establecer disponibilidad a 'sí' al crear una nueva cita
      });
      // Limpiar los campos del formulario
      setSpecialty('');
      setDoctor('');
      setDate('');
      setTime('');
      setDescription('');
      // SweetAlert success message
      Swal.fire({
        icon: 'success',
        title: 'Cita creada',
        text: 'La cita médica se ha creado con éxito.',
        confirmButtonText: 'Aceptar',
      });
    } catch (error) {
      console.error('Error creating appointment: ', error);
      // SweetAlert error message
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Hubo un error al crear la cita médica.',
        confirmButtonText: 'Aceptar',
      });
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <label>Especialidad</label>
        <input
          type="text"
          className="form-control"
          value={specialty}
          onChange={(e) => setSpecialty(e.target.value)}
          required
        />
      </div>
      <div className="form-group">
        <label>Doctor</label>
        <input
          type="text"
          className="form-control"
          value={doctor}
          onChange={(e) => setDoctor(e.target.value)}
          required
        />
      </div>
      <div className="form-group">
        <label>Fecha</label>
        <input
          type="date"
          className="form-control"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
        />
      </div>
      <div className="form-group">
        <label>Hora</label>
        <input
          type="time"
          className="form-control"
          value={time}
          onChange={(e) => setTime(e.target.value)}
          required
        />
      </div>
      <div className="form-group">
        <label>Descripción</label>
        <textarea
          className="form-control"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
      </div>
      <button type="submit" className="btn btn-primary">Crear Cita</button>
    </form>
  );
};

export default AppointmentForm;