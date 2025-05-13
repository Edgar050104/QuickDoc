import { useState } from 'react';
import { 
  Calendar, 
  Clock, 
  User, 
  Hospital, 
  FileText, 
  Download, 
  Plus, 
  LogIn, 
  LogOut,
  Settings,
  Search,
  Home,
  HelpCircle,
  CheckCircle,
  XCircle,
  Edit,
  Stethoscope,
} from 'lucide-react';

// Componente principal de la aplicación
export default function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userType, setUserType] = useState(''); // 'patient' o 'doctor'
  const [showNewAppointmentForm, setShowNewAppointmentForm] = useState(false);
  const [searchAppointmentId, setSearchAppointmentId] = useState('');
  
  // Datos de ejemplo
  const [appointments, setAppointments] = useState([
    { id: 101, date: '2025-05-15', time: '09:30', doctor: 'Dr. García Fernández', hospital: 'Hospital Universitario', patientName: 'María López', symptoms: 'Dolor de cabeza, mareos', observations: 'Paciente con antecedentes de migraña', status: 'pending' },
    { id: 102, date: '2025-05-22', time: '16:00', doctor: 'Dra. Martínez López', hospital: 'Clínica Santa María', patientName: 'Juan Pérez', symptoms: 'Dolor abdominal, náuseas', observations: 'Posible gastritis', status: 'pending' }
  ]);
  
  const [prescriptions, setPrescriptions] = useState([
    { id: 201, date: '2025-05-05', doctor: 'Dr. García Fernández', diagnosis: 'Gripe común', medicines: ['Paracetamol 500mg', 'Ibuprofeno 400mg'], patientName: 'María López' },
    { id: 202, date: '2025-04-20', doctor: 'Dra. Martínez López', diagnosis: 'Alergia estacional', medicines: ['Cetirizina 10mg', 'Spray nasal Flutiform'], patientName: 'Juan Pérez' }
  ]);
  
  const doctors = [
    { id: 1, name: 'Dr. García Fernández', specialty: 'Medicina General', availableHours: ['09:00', '09:30', '10:00', '10:30', '11:00'] },
    { id: 2, name: 'Dra. Martínez López', specialty: 'Cardiología', availableHours: ['15:00', '15:30', '16:00', '16:30', '17:00'] },
    { id: 3, name: 'Dr. Rodríguez Vega', specialty: 'Dermatología', availableHours: ['12:00', '12:30', '13:00', '16:00', '16:30'] }
  ];
  
  const hospitals = [
    { id: 1, name: 'Hospital Universitario' },
    { id: 2, name: 'Clínica Santa María' },
    { id: 3, name: 'Centro Médico Internacional' }
  ];

  const [userData, setUserData] = useState({
    name: 'Usuario Ejemplo',
    email: 'usuario@ejemplo.com',
    password: '********',
    phone: '555-123-4567'
  });
  
  // Manejo de navegación
  const navigateTo = (page) => {
    setCurrentPage(page);
    setShowNewAppointmentForm(false);
  };
  
  // Añadir nueva cita
  const addNewAppointment = (appointment) => {
    const newAppointment = {
      id: 100 + appointments.length + 1,
      patientName: userData.name,
      status: 'pending',
      ...appointment
    };
    setAppointments([...appointments, newAppointment]);
    setShowNewAppointmentForm(false);
  };
  
  // Manejo de Login/Logout
  const handleLogin = (type) => {
    setIsLoggedIn(true);
    setUserType(type);
    navigateTo(type === 'doctor' ? 'doctorAppointments' : 'appointments');
  };
  
  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserType('');
    navigateTo('home');
  };

  // Actualizar datos de usuario
  const updateUserData = (newData) => {
    setUserData({...userData, ...newData});
  };

  // Manejo de citas por el doctor
  const handleAppointmentAction = (id, action) => {
    setAppointments(appointments.map(app => 
      app.id === id ? {...app, status: action} : app
    ));
  };

  // Añadir diagnóstico y medicamentos
  const addDiagnosis = (appointmentId, diagnosis, medicines) => {
    // Buscar la cita correspondiente
    const appointment = appointments.find(app => app.id === appointmentId);
    
    if (appointment) {
      // Crear nueva receta
      const newPrescription = {
        id: 200 + prescriptions.length + 1,
        date: appointment.date,
        doctor: appointment.doctor,
        diagnosis,
        medicines,
        patientName: appointment.patientName
      };
      
      setPrescriptions([...prescriptions, newPrescription]);
      
      // Actualizar estado de la cita
      setAppointments(appointments.map(app => 
        app.id === appointmentId ? {...app, status: 'completed'} : app
      ));
    }
  };

  // Buscar cita por ID
  const filteredAppointments = searchAppointmentId 
    ? appointments.filter(app => app.id.toString().includes(searchAppointmentId))
    : appointments;

  // Filtrar citas para doctores según el estado
  const pendingAppointments = appointments.filter(app => app.status === 'pending');
  const acceptedAppointments = appointments.filter(app => app.status === 'accepted');
  const completedAppointments = appointments.filter(app => app.status === 'completed');
  const canceledAppointments = appointments.filter(app => app.status === 'canceled');
  
  // Renderizar la página actual
  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage onBookAppointment={() => navigateTo('register')} onDoctorLogin={() => navigateTo('doctorLogin')} />;
      case 'register':
        return <RegisterPage onGoToLogin={() => navigateTo('login')} onRegister={() => handleLogin('patient')} />;
      case 'login':
        return <LoginPage onGoToRegister={() => navigateTo('register')} onLogin={() => handleLogin('patient')} />;
      case 'doctorLogin':
        return <DoctorLoginPage onLogin={() => handleLogin('doctor')} />;
      case 'appointments':
        return (
          <AppointmentsPage 
            appointments={filteredAppointments} 
            onNewAppointment={() => setShowNewAppointmentForm(true)}
            searchId={searchAppointmentId}
            setSearchId={setSearchAppointmentId}
          />
        );
      case 'prescriptions':
        return <PrescriptionsPage prescriptions={prescriptions} />;
      case 'settings':
        return <SettingsPage userData={userData} onUpdateData={updateUserData} />;
      case 'support':
        return <SupportPage />;
      case 'doctorAppointments':
        return <DoctorAppointmentsPage 
          pendingAppointments={pendingAppointments}
          acceptedAppointments={acceptedAppointments}
          completedAppointments={completedAppointments}
          canceledAppointments={canceledAppointments}
          onAppointmentAction={handleAppointmentAction}
          onAddDiagnosis={addDiagnosis}
        />;
      default:
        return <HomePage onBookAppointment={() => navigateTo('register')} />;
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Barra lateral (solo si está logueado) */}
      {isLoggedIn && (
        <div className="w-64 bg-blue-700 text-white min-h-screen">
          <div className="p-4 text-xl font-bold">QuickDoc</div>
          <div className="mt-8">
            {userType === 'patient' ? (
              <>
                <SidebarMenuItem 
                  icon={<Home size={20} />} 
                  label="Inicio" 
                  active={currentPage === 'home'}
                  onClick={() => navigateTo('home')}
                />
                <SidebarMenuItem 
                  icon={<Calendar size={20} />} 
                  label="Mis Citas" 
                  active={currentPage === 'appointments'}
                  onClick={() => navigateTo('appointments')}
                />
                <SidebarMenuItem 
                  icon={<FileText size={20} />} 
                  label="Mis Recetas" 
                  active={currentPage === 'prescriptions'}
                  onClick={() => navigateTo('prescriptions')}
                />
                <SidebarMenuItem 
                  icon={<Settings size={20} />} 
                  label="Configuración" 
                  active={currentPage === 'settings'}
                  onClick={() => navigateTo('settings')}
                />
                <SidebarMenuItem 
                  icon={<HelpCircle size={20} />} 
                  label="Soporte" 
                  active={currentPage === 'support'}
                  onClick={() => navigateTo('support')}
                />
              </>
            ) : (
              <>
                <SidebarMenuItem 
                  icon={<Calendar size={20} />} 
                  label="Citas Pendientes" 
                  active={currentPage === 'doctorAppointments'}
                  onClick={() => navigateTo('doctorAppointments')}
                />
                <SidebarMenuItem 
                  icon={<CheckCircle size={20} />} 
                  label="Historial" 
                  active={currentPage === 'doctorHistory'}
                  onClick={() => navigateTo('doctorHistory')}
                />
                <SidebarMenuItem 
                  icon={<Settings size={20} />} 
                  label="Configuración" 
                  active={currentPage === 'settings'}
                  onClick={() => navigateTo('settings')}
                />
              </>
            )}
            <div className="mt-auto pt-10">
              <SidebarMenuItem 
                icon={<LogOut size={20} />} 
                label="Cerrar Sesión" 
                onClick={handleLogout}
              />
            </div>
          </div>
        </div>
      )}
      
      {/* Contenido principal */}
      <div className="flex-1">
        {!isLoggedIn && (
          <nav className="bg-blue-600 text-white p-4">
            <div className="container mx-auto flex justify-between items-center">
              <div className="text-xl font-bold cursor-pointer" onClick={() => navigateTo('home')}>
                QuickDoc
              </div>
              
              <button 
                className="flex items-center bg-white text-blue-600 hover:bg-blue-50 px-4 py-1 rounded"
                onClick={() => navigateTo('login')}
              >
                <LogIn size={16} className="mr-1" /> Iniciar Sesión
              </button>
            </div>
          </nav>
        )}
        
        <div className="container mx-auto py-8 px-4">
          {renderPage()}
        </div>
        
        {/* Modal para crear nueva cita */}
        {showNewAppointmentForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <NewAppointmentForm 
              doctors={doctors}
              hospitals={hospitals}
              onCancel={() => setShowNewAppointmentForm(false)}
              onSave={addNewAppointment}
            />
          </div>
        )}
      </div>
    </div>
  );
}

// Componente para el elemento del menú lateral
function SidebarMenuItem({ icon, label, active, onClick }) {
  return (
    <div 
      className={`flex items-center px-6 py-3 cursor-pointer transition-colors ${active ? 'bg-blue-800' : 'hover:bg-blue-600'}`}
      onClick={onClick}
    >
      <div className="mr-3 text-blue-300">
        {icon}
      </div>
      <span>{label}</span>
    </div>
  );
}

// Componente de la página principal
function HomePage({ onBookAppointment, onDoctorLogin }) {
  return (
    <div className="flex flex-col items-center justify-center py-16">
      <h1 className="text-4xl font-bold text-center mb-6">Tu salud, nuestra prioridad</h1>
      <p className="text-xl text-gray-600 text-center mb-10 max-w-2xl">
        Reserva citas médicas de forma rápida y sencilla con los mejores especialistas
      </p>
      <div className="flex flex-col md:flex-row gap-4">
        <button 
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg text-lg shadow-lg transition-all"
          onClick={onBookAppointment}
        >
          Reservar cita médica
        </button>
        <button 
          className="bg-white border-2 border-blue-600 text-blue-600 hover:bg-blue-50 font-bold py-3 px-8 rounded-lg text-lg shadow-lg transition-all flex items-center justify-center"
          onClick={onDoctorLogin}
        >
          <Stethoscope size={20} className="mr-2" />
          Acceso para médicos
        </button>
      </div>
    </div>
  );
}

// Componente de la página de registro
function RegisterPage({ onGoToLogin, onRegister }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  
  const handleSubmit = () => {
    // Aquí iría la lógica de validación y registro
    onRegister();
  };
  
  return (
    <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-center mb-6">Crear una cuenta</h2>
      
      <div className="mb-4">
        <label className="block text-gray-700 mb-2" htmlFor="name">Nombre completo</label>
        <input
          id="name"
          name="name"
          type="text"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={formData.name}
          onChange={handleChange}
          required
        />
      </div>
      
      <div className="mb-4">
        <label className="block text-gray-700 mb-2" htmlFor="email">Correo electrónico</label>
        <input
          id="email"
          name="email"
          type="email"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={formData.email}
          onChange={handleChange}
          required
        />
      </div>
      
      <div className="mb-4">
        <label className="block text-gray-700 mb-2" htmlFor="password">Contraseña</label>
        <input
          id="password"
          name="password"
          type="password"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={formData.password}
          onChange={handleChange}
          required
        />
      </div>
      
      <div className="mb-6">
        <label className="block text-gray-700 mb-2" htmlFor="confirmPassword">Confirmar contraseña</label>
        <input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={formData.confirmPassword}
          onChange={handleChange}
          required
        />
      </div>
      
      <button
        onClick={handleSubmit}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md"
      >
        Registrarse
      </button>
      
      <div className="text-center mt-4">
        <p className="text-gray-600">
          ¿Ya tienes una cuenta?{' '}
          <span 
            className="text-blue-600 cursor-pointer hover:underline"
            onClick={onGoToLogin}
          >
            Iniciar sesión
          </span>
        </p>
      </div>
    </div>
  );
}

// Componente de la página de inicio de sesión
function LoginPage({ onGoToRegister, onLogin }) {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  
  const handleSubmit = () => {
    // Aquí iría la lógica de autenticación
    onLogin();
  };
  
  return (
    <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-center mb-6">Iniciar sesión</h2>
      
      <div className="mb-4">
        <label className="block text-gray-700 mb-2" htmlFor="email">Correo electrónico</label>
        <input
          id="email"
          name="email"
          type="email"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={formData.email}
          onChange={handleChange}
          required
        />
      </div>
      
      <div className="mb-6">
        <label className="block text-gray-700 mb-2" htmlFor="password">Contraseña</label>
        <input
          id="password"
          name="password"
          type="password"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={formData.password}
          onChange={handleChange}
          required
        />
      </div>
      
      <button
        onClick={handleSubmit}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md"
      >
        Iniciar sesión
      </button>
      
      <div className="text-center mt-4">
        <p className="text-gray-600">
          ¿No tienes una cuenta?{' '}
          <span 
            className="text-blue-600 cursor-pointer hover:underline"
            onClick={onGoToRegister}
          >
            Regístrate
          </span>
        </p>
      </div>
    </div>
  );
}

// Componente de inicio de sesión para doctores
function DoctorLoginPage({ onLogin }) {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    licenseNumber: ''
  });
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  
  const handleSubmit = () => {
    // Aquí iría la lógica de autenticación para médicos
    onLogin();
  };
  
  return (
    <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md">
      <div className="flex items-center justify-center mb-6">
        <Stethoscope size={28} className="text-blue-600 mr-2" />
        <h2 className="text-2xl font-bold">Portal médico</h2>
      </div>
      
      <div className="mb-4">
        <label className="block text-gray-700 mb-2" htmlFor="email">Correo electrónico profesional</label>
        <input
          id="email"
          name="email"
          type="email"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={formData.email}
          onChange={handleChange}
          required
        />
      </div>
      
      <div className="mb-4">
        <label className="block text-gray-700 mb-2" htmlFor="licenseNumber">Número de licencia médica</label>
        <input
          id="licenseNumber"
          name="licenseNumber"
          type="text"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={formData.licenseNumber}
          onChange={handleChange}
          required
        />
      </div>
      
      <div className="mb-6">
        <label className="block text-gray-700 mb-2" htmlFor="password">Contraseña</label>
        <input
          id="password"
          name="password"
          type="password"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={formData.password}
          onChange={handleChange}
          required
        />
      </div>
      
      <button
        onClick={handleSubmit}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md"
      >
        Acceder
      </button>
    </div>
  );
}

// Componente de la página de citas
function AppointmentsPage({ appointments, onNewAppointment, searchId, setSearchId }) {
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Mis Citas</h2>
        <div className="flex space-x-3">
          <div className="relative">
            <input
              type="text"
              placeholder="Buscar por ID"
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchId}
              onChange={(e) => setSearchId(e.target.value)}
            />
            <Search size={18} className="absolute left-3 top-2.5 text-gray-400" />
          </div>
          <button 
            className="flex items-center bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md"
            onClick={onNewAppointment}
          >
            <Plus size={18} className="mr-1" /> Nueva cita
          </button>
        </div>
      </div>
      
      {appointments.length === 0 ? (
        <div className="text-center py-10 text-gray-500">
          No tienes citas programadas. ¡Crea una nueva!
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {appointments.map(appointment => (
            <AppointmentCard key={appointment.id} appointment={appointment} />
          ))}
        </div>
      )}
    </div>
  );
}

// Componente para la tarjeta de cita
function AppointmentCard({ appointment }) {
  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-800 border-yellow-300',
    accepted: 'bg-green-100 text-green-800 border-green-300',
    canceled: 'bg-red-100 text-red-800 border-red-300',
    completed: 'bg-blue-100 text-blue-800 border-blue-300'
  };

  const statusLabels = {
    pending: 'Pendiente',
    accepted: 'Aceptada',
    canceled: 'Cancelada',
    completed: 'Completada'
  };
  
  return (
    <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-blue-500">
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center mb-3">
          <Calendar size={18} className="text-blue-600 mr-2" />
          <span className="font-medium">{appointment.date}</span>
          <Clock size={18} className="text-blue-600 ml-4 mr-2" />
          <span>{appointment.time}</span>
        </div>
        <div className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[appointment.status] || statusColors.pending}`}>
          {statusLabels[appointment.status] || 'Pendiente'}
        </div>
      </div>
      
      <div className="flex items-center mb-3">
        <User size={18} className="text-blue-600 mr-2" />
        <span>{appointment.doctor}</span>
      </div>
      
      <div className="flex items-center mb-3">
        <Hospital size={18} className="text-blue-600 mr-2" />
        <span>{appointment.hospital}</span>
      </div>

      <div className="mt-2 flex justify-between items-center text-sm text-gray-500">
        <span>ID: {appointment.id}</span>
      </div>
    </div>
  );
}

// Componente para el formulario de nueva cita
function NewAppointmentForm({ doctors, hospitals, onCancel, onSave }) {
  const [formData, setFormData] = useState({
    doctor: '',
    hospital: '',
    date: '',
    time: '',
    symptoms: '',
    observations: ''
  });
  
  const [availableHours, setAvailableHours] = useState([]);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    // Si cambia el doctor, actualizar las horas disponibles
    if (name === 'doctor') {
      const selectedDoctor = doctors.find(doc => doc.name === value);
      setAvailableHours(selectedDoctor ? selectedDoctor.availableHours : []);
      setFormData(prev => ({ ...prev, time: '' })); // Reset time selection
    }
  };
  
  const handleSubmit = () => {
    onSave(formData);
  };
  
  return (
    <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
      <h3 className="text-xl font-bold mb-4">Nueva Cita</h3>
      
      <div className="mb-4">
        <label className="block text-gray-700 mb-2" htmlFor="doctor">Doctor</label>
        <select
          id="doctor"
          name="doctor"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={formData.doctor}
          onChange={handleChange}
          required
        >
          <option value="">Selecciona un doctor</option>
          {doctors.map(doctor => (
            <option key={doctor.id} value={doctor.name}>
              {doctor.name} - {doctor.specialty}
            </option>
          ))}
        </select>
      </div>
      
      <div className="mb-4">
        <label className="block text-gray-700 mb-2" htmlFor="hospital">Hospital</label>
        <select
          id="hospital"
          name="hospital"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={formData.hospital}
          onChange={handleChange}
          required
        >
          <option value="">Selecciona un hospital</option>
          {hospitals.map(hospital => (
            <option key={hospital.id} value={hospital.name}>
              {hospital.name}
            </option>
          ))}
        </select>
      </div>
      
      <div className="mb-4">
        <label className="block text-gray-700 mb-2" htmlFor="date">Fecha</label>
        <input
          id="date"
          name="date"
          type="date"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={formData.date}
          onChange={handleChange}
          required
        />
      </div>
      
      <div className="mb-4">
        <label className="block text-gray-700 mb-2" htmlFor="time">Hora</label>
        <select
          id="time"
          name="time"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={formData.time}
          onChange={handleChange}
          required
          disabled={!formData.doctor}
        >
          <option value="">Selecciona una hora</option>
          {availableHours.map(hour => (
            <option key={hour} value={hour}>
              {hour}
            </option>
          ))}
        </select>
      </div>
      
      <div className="mb-4">
        <label className="block text-gray-700 mb-2" htmlFor="symptoms">Síntomas</label>
        <textarea
          id="symptoms"
          name="symptoms"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={formData.symptoms}
          onChange={handleChange}
          rows="3"
          placeholder="Describe tus síntomas"
        ></textarea>
      </div>
      
      <div className="mb-6">
        <label className="block text-gray-700 mb-2" htmlFor="observations">Observaciones adicionales</label>
        <textarea
          id="observations"
          name="observations"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={formData.observations}
          onChange={handleChange}
          rows="2"
          placeholder="Información adicional relevante"
        ></textarea>
      </div>
      
      <div className="flex justify-end space-x-3">
        <button
          type="button"
          className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100"
          onClick={onCancel}
        >
          Cancelar
        </button>
        <button
          onClick={handleSubmit}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Guardar
        </button>
      </div>
    </div>
  );
}

// Componente de la página de recetas
function PrescriptionsPage({ prescriptions }) {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Mis Recetas</h2>
      
      {prescriptions.length === 0 ? (
        <div className="text-center py-10 text-gray-500">
          No tienes recetas médicas disponibles.
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {prescriptions.map(prescription => (
            <PrescriptionCard key={prescription.id} prescription={prescription} />
          ))}
        </div>
      )}
    </div>
  );
}

// Componente para la tarjeta de receta
function PrescriptionCard({ prescription }) {
  const handleDownload = () => {
    // Aquí iría la lógica para generar y descargar el PDF
    alert('Descargando receta en PDF...');
  };
  
  return (
    <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-green-500">
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center">
          <Calendar size={18} className="text-green-600 mr-2" />
          <span className="font-medium">{prescription.date}</span>
        </div>
        <button 
          onClick={handleDownload}
          className="flex items-center text-green-600 hover:text-green-700"
        >
          <Download size={18} className="mr-1" /> PDF
        </button>
      </div>
      
      <div className="flex items-center mb-3">
        <User size={18} className="text-green-600 mr-2" />
        <span>{prescription.doctor}</span>
      </div>
      
      <div className="mb-3">
        <div className="font-medium text-gray-700 mb-1">Diagnóstico:</div>
        <div className="pl-2 text-gray-800">{prescription.diagnosis}</div>
      </div>
      
      <div>
        <div className="font-medium text-gray-700 mb-1">Medicamentos:</div>
        <ul className="pl-2 text-gray-800">
          {prescription.medicines.map((medicine, index) => (
            <li key={index} className="flex items-center mb-1">
              <FileText size={14} className="text-green-600 mr-2" />
              {medicine}
            </li>
          ))}
        </ul>
      </div>
      
      <div className="mt-2 text-sm text-gray-500">
        ID: {prescription.id}
      </div>
    </div>
  );
}

// Componente de la página de configuración
function SettingsPage({ userData, onUpdateData }) {
  const [formData, setFormData] = useState({
    name: userData.name,
    email: userData.email,
    phone: userData.phone,
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: ''
  });

  const [isEditing, setIsEditing] = useState(false);
  const [message, setMessage] = useState('');
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  
  const handleSubmit = () => {
    // Aquí iría la lógica de validación
    const { currentPassword, newPassword, confirmNewPassword, ...dataToUpdate } = formData;
    
    // Actualizar contraseña si se proporciona
    if (newPassword && newPassword === confirmNewPassword) {
      dataToUpdate.password = newPassword;
    }
    
    onUpdateData(dataToUpdate);
    setIsEditing(false);
    setMessage('Datos actualizados correctamente');
    
    // Limpiar campos de contraseña
    setFormData(prev => ({
      ...prev,
      currentPassword: '',
      newPassword: '',
      confirmNewPassword: ''
    }));
    
    // Limpiar mensaje después de un tiempo
    setTimeout(() => {
      setMessage('');
    }, 3000);
  };
  
  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Configuración de cuenta</h2>
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="flex items-center text-blue-600 hover:text-blue-700"
          >
            <Edit size={18} className="mr-1" /> Editar información
          </button>
        )}
      </div>
      
      {message && (
        <div className="bg-green-100 border border-green-300 text-green-700 px-4 py-3 rounded mb-4">
          {message}
        </div>
      )}
      
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <h3 className="text-lg font-semibold mb-4 border-b pb-2">Información personal</h3>
        
        <div className="mb-4">
          <label className="block text-gray-700 mb-2" htmlFor="name">Nombre completo</label>
          {isEditing ? (
            <input
              id="name"
              name="name"
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={formData.name}
              onChange={handleChange}
            />
          ) : (
            <div className="px-3 py-2 bg-gray-50 rounded-md">{userData.name}</div>
          )}
        </div>
        
        <div className="mb-4">
          <label className="block text-gray-700 mb-2" htmlFor="email">Correo electrónico</label>
          {isEditing ? (
            <input
              id="email"
              name="email"
              type="email"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={formData.email}
              onChange={handleChange}
            />
          ) : (
            <div className="px-3 py-2 bg-gray-50 rounded-md">{userData.email}</div>
          )}
        </div>
        
        <div className="mb-4">
          <label className="block text-gray-700 mb-2" htmlFor="phone">Teléfono</label>
          {isEditing ? (
            <input
              id="phone"
              name="phone"
              type="tel"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={formData.phone}
              onChange={handleChange}
            />
          ) : (
            <div className="px-3 py-2 bg-gray-50 rounded-md">{userData.phone}</div>
          )}
        </div>
      </div>
      
      {isEditing && (
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h3 className="text-lg font-semibold mb-4 border-b pb-2">Cambiar contraseña</h3>
          
          <div className="mb-4">
            <label className="block text-gray-700 mb-2" htmlFor="currentPassword">Contraseña actual</label>
            <input
              id="currentPassword"
              name="currentPassword"
              type="password"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={formData.currentPassword}
              onChange={handleChange}
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-700 mb-2" htmlFor="newPassword">Nueva contraseña</label>
            <input
              id="newPassword"
              name="newPassword"
              type="password"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={formData.newPassword}
              onChange={handleChange}
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-700 mb-2" htmlFor="confirmNewPassword">Confirmar nueva contraseña</label>
            <input
              id="confirmNewPassword"
              name="confirmNewPassword"
              type="password"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={formData.confirmNewPassword}
              onChange={handleChange}
            />
          </div>
        </div>
      )}
      
      {isEditing && (
        <div className="flex justify-end space-x-3 mt-4">
          <button
            type="button"
            className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100"
            onClick={() => setIsEditing(false)}
          >
            Cancelar
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Guardar cambios
          </button>
        </div>
      )}
    </div>
  );
}

// Componente de la página de soporte
function SupportPage() {
  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Soporte y ayuda</h2>
      
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <h3 className="text-lg font-semibold mb-4">Preguntas frecuentes</h3>
        
        <div className="space-y-4">
          <div>
            <h4 className="font-medium text-blue-600">¿Cómo puedo cancelar una cita?</h4>
            <p className="mt-1 text-gray-600">Para cancelar una cita, debes contactar directamente con el centro médico con al menos 24 horas de antelación.</p>
          </div>
          
          <div>
            <h4 className="font-medium text-blue-600">¿Puedo modificar la hora de mi cita?</h4>
            <p className="mt-1 text-gray-600">Sí, puedes modificar la hora de tu cita siempre que haya disponibilidad en el horario del médico seleccionado.</p>
          </div>
          
          <div>
            <h4 className="font-medium text-blue-600">¿Cómo puedo descargar mis recetas médicas?</h4>
            <p className="mt-1 text-gray-600">En la sección "Mis Recetas" encontrarás todas tus recetas disponibles con un botón para descargarlas en formato PDF.</p>
          </div>
        </div>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-4">Contacto</h3>
        
        <div className="mb-4">
          <p className="text-gray-600">Si tienes alguna duda o problema, puedes contactarnos a través de:</p>
          
          <div className="mt-3 space-y-2">
            <div className="flex items-center">
              <span className="font-medium w-24">Email:</span>
              <span>soporte@medicitas.com</span>
            </div>
            
            <div className="flex items-center">
              <span className="font-medium w-24">Teléfono:</span>
              <span>+52 55 1234 5678</span>
            </div>
            
            <div className="flex items-center">
              <span className="font-medium w-24">Horario:</span>
              <span>Lunes a viernes de 9:00 a 18:00</span>
            </div>
          </div>
        </div>
        
        <div className="mt-6">
          <button className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md">
            Iniciar chat de soporte
          </button>
        </div>
      </div>
    </div>
  );
}

// Componente de la página de citas para doctores
function DoctorAppointmentsPage({ 
  pendingAppointments, 
  acceptedAppointments, 
  completedAppointments, 
  canceledAppointments,
  onAppointmentAction,
  onAddDiagnosis 
}) {
  const [activeTab, setActiveTab] = useState('pending');
  const [showDiagnosisForm, setShowDiagnosisForm] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  const handleComplete = (appointment) => {
    setSelectedAppointment(appointment);
    setShowDiagnosisForm(true);
  };
  
  const filteredAppointments = () => {
    let appointments = [];
    
    switch (activeTab) {
      case 'pending':
        appointments = pendingAppointments;
        break;
      case 'accepted':
        appointments = acceptedAppointments;
        break;
      case 'completed':
        appointments = completedAppointments;
        break;
      case 'canceled':
        appointments = canceledAppointments;
        break;
      default:
        appointments = pendingAppointments;
    }
    
    if (!searchTerm) return appointments;
    
    return appointments.filter(app => 
      app.id.toString().includes(searchTerm) || 
      app.patientName.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };
  
  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Gestión de citas médicas</h2>
      
      <div className="flex mb-6 overflow-x-auto">
        <button
          className={`px-4 py-2 border-b-2 font-medium ${activeTab === 'pending' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
          onClick={() => setActiveTab('pending')}
        >
          Pendientes ({pendingAppointments.length})
        </button>
        <button
          className={`px-4 py-2 border-b-2 font-medium ${activeTab === 'accepted' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
          onClick={() => setActiveTab('accepted')}
        >
          Aceptadas ({acceptedAppointments.length})
        </button>
        <button
          className={`px-4 py-2 border-b-2 font-medium ${activeTab === 'completed' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
          onClick={() => setActiveTab('completed')}
        >
          Completadas ({completedAppointments.length})
        </button>
        <button
          className={`px-4 py-2 border-b-2 font-medium ${activeTab === 'canceled' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
          onClick={() => setActiveTab('canceled')}
        >
          Canceladas ({canceledAppointments.length})
        </button>
      </div>
      
      <div className="flex justify-between items-center mb-6">
        <div className="relative">
          <input
            type="text"
            placeholder="Buscar por ID o paciente"
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Search size={18} className="absolute left-3 top-2.5 text-gray-400" />
        </div>
      </div>
      
      {filteredAppointments().length === 0 ? (
        <div className="text-center py-10 text-gray-500">
          No hay citas en esta categoría.
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {filteredAppointments().map(appointment => (
            <DoctorAppointmentCard 
              key={appointment.id} 
              appointment={appointment}
              activeTab={activeTab}
              onAccept={() => onAppointmentAction(appointment.id, 'accepted')}
              onCancel={() => onAppointmentAction(appointment.id, 'canceled')}
              onComplete={() => handleComplete(appointment)}
            />
          ))}
        </div>
      )}
      
      {/* Modal para diagnóstico */}
      {showDiagnosisForm && selectedAppointment && (
        <DiagnosisForm
          appointment={selectedAppointment}
          onCancel={() => setShowDiagnosisForm(false)}
          onSave={(diagnosis, medicines) => {
            onAddDiagnosis(selectedAppointment.id, diagnosis, medicines);
            setShowDiagnosisForm(false);
          }}
        />
      )}
    </div>
  );
}

// Componente para la tarjeta de cita (vista de doctor)
function DoctorAppointmentCard({ appointment, activeTab, onAccept, onCancel, onComplete }) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-blue-500">
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center mb-3">
          <Calendar size={18} className="text-blue-600 mr-2" />
          <span className="font-medium">{appointment.date}</span>
          <Clock size={18} className="text-blue-600 ml-4 mr-2" />
          <span>{appointment.time}</span>
        </div>
        <div className="text-sm font-medium text-gray-500">
          ID: {appointment.id}
        </div>
      </div>
      
      <div className="flex items-center mb-3">
        <User size={18} className="text-blue-600 mr-2" />
        <span className="font-medium">{appointment.patientName}</span>
      </div>
      
      <div className="flex items-center mb-3">
        <Hospital size={18} className="text-blue-600 mr-2" />
        <span>{appointment.hospital}</span>
      </div>
      
      {appointment.symptoms && (
        <div className="mb-3">
          <div className="font-medium text-gray-700 mb-1">Síntomas:</div>
          <div className="pl-2 text-gray-800">{appointment.symptoms}</div>
        </div>
      )}
      
      {appointment.observations && (
        <div className="mb-3">
          <div className="font-medium text-gray-700 mb-1">Observaciones:</div>
          <div className="pl-2 text-gray-800">{appointment.observations}</div>
        </div>
      )}
      
      {activeTab === 'pending' && (
        <div className="flex justify-end space-x-2 mt-4">
          <button
            onClick={onCancel}
            className="px-3 py-1 bg-red-100 text-red-600 rounded-md hover:bg-red-200 flex items-center"
          >
            <XCircle size={16} className="mr-1" /> Cancelar
          </button>
          <button
            onClick={onAccept}
            className="px-3 py-1 bg-green-100 text-green-600 rounded-md hover:bg-green-200 flex items-center"
          >
            <CheckCircle size={16} className="mr-1" /> Aceptar
          </button>
        </div>
      )}
      
      {activeTab === 'accepted' && (
        <div className="flex justify-end mt-4">
          <button
            onClick={onComplete}
            className="px-3 py-1 bg-blue-100 text-blue-600 rounded-md hover:bg-blue-200 flex items-center"
          >
            <Edit size={16} className="mr-1" /> Completar visita
          </button>
        </div>
      )}
    </div>
  );
}

// Componente para el formulario de diagnóstico
function DiagnosisForm({ appointment, onCancel, onSave }) {
  const [diagnosis, setDiagnosis] = useState('');
  const [medicines, setMedicines] = useState(['']);
  
  const addMedicine = () => {
    setMedicines([...medicines, '']);
  };
  
  const removeMedicine = (index) => {
    if (medicines.length > 1) {
      const newMedicines = [...medicines];
      newMedicines.splice(index, 1);
      setMedicines(newMedicines);
    }
  };
  
  const updateMedicine = (index, value) => {
    const newMedicines = [...medicines];
    newMedicines[index] = value;
    setMedicines(newMedicines);
  };
  
  const handleSubmit = () => {
    // Filtrar medicamentos vacíos
    const filteredMedicines = medicines.filter(med => med.trim() !== '');
    onSave(diagnosis, filteredMedicines);
  };
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
        <h3 className="text-xl font-bold mb-4">Diagnóstico y receta</h3>
        <p className="mb-4 text-gray-600">Paciente: {appointment.patientName}</p>
        
        <div className="mb-4">
          <label className="block text-gray-700 mb-2" htmlFor="diagnosis">Diagnóstico</label>
          <textarea
            id="diagnosis"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={diagnosis}
            onChange={(e) => setDiagnosis(e.target.value)}
            rows="3"
            placeholder="Ingrese el diagnóstico"
            required
          ></textarea>
        </div>
        
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Medicamentos</label>
          
          {medicines.map((medicine, index) => (
            <div key={index} className="flex items-center mb-2">
              <input
                type="text"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={medicine}
                onChange={(e) => updateMedicine(index, e.target.value)}
                placeholder="Nombre del medicamento y dosis"
              />
              
              <button
                type="button"
                className="ml-2 text-red-500 hover:text-red-700"
                onClick={() => removeMedicine(index)}
                disabled={medicines.length === 1}
              >
                <XCircle size={20} />
              </button>
            </div>
          ))}
          
          <button
            type="button"
            className="mt-2 flex items-center text-blue-600 hover:text-blue-700"
            onClick={addMedicine}
          >
            <Plus size={16} className="mr-1" /> Añadir medicamento
          </button>
        </div>
        
        <div className="flex justify-end space-x-3 mt-6">
          <button
            type="button"
            className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100"
            onClick={onCancel}
          >
            Cancelar
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            disabled={!diagnosis.trim()}
          >
            Guardar y completar
          </button>
        </div>
      </div>
    </div>
  );
}