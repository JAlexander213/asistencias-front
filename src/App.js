import { BrowserRouter as Router, Route, Routes, Link, useLocation } from 'react-router-dom';
import './App.css';
import Login from './auth/Login.jsx';
import Register from './auth/Register.jsx';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import Index from './auth/Index.jsx';
import ProtectedRoute from './auth/ProtectedRoute.jsx';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Profile from './auth/Profile.jsx';
import Settings from './auth/Settings.jsx';
import UploadCSV from './auth/UploadCSV.jsx';
import CheckTables from './auth/CheckTables.jsx';
import Schedules from './auth/Schedules.jsx';
import { Menu } from './auth/Menu.jsx';

function MainContent() {
  const navigate = useNavigate();
  
  useEffect(() => {
    if (localStorage.getItem("auth") === "true") {
      navigate("/auth/index", { replace: true });
    }
  }, [navigate]);

  return (
    <header className="App-header">
      <header className="InicioS-header">
        <Link className="InicioS-link1" to="https://cecytem.edomex.gob.mx/">Pagina Oficial</Link>
        <Link className="InicioS-link2" to="https://cecytem.mx/deo/gui/LogIn.jsp">Deo</Link>
        <Link className="InicioS-link3" to="/auth/login">Iniciar sesión</Link>
      </header>
      <br />
      <br />
      <br/>
      <h3 className='App-Cecytem'>Colegio de Estudios Cientificos Y Tecnologicos Del Estado de Mexico</h3>

      <div className='App-logo'>
        <img src="https://cecytem.edomex.gob.mx/themes/seitheme3/logo.svg" className="App-logo" alt="logo"></img>
      </div>
      <br/>
      <div className='App-Content1'>
        <h1 className="App-title">CECyTEM <br/>
          Information Manager</h1>
        
        <div className="grid-container">
          <div className="card">
            <h2 style={{ fontFamily: 'Arial, sans-serif', fontWeight: 'bold', color: '#8a2036' }}>Bienvenido 
              <br/>
              a CIM</h2> 
            <p style={{ fontFamily: 'Arial, sans-serif', color: '#000' }}>CIM <br/>(Cecytem Information Manager) <br/>Es un sistema amigable que se encarga de proteger tu informacion </p>
            <p style={{ fontFamily: 'Arial, sans-serif', color: '#000' }}>Aquí podrás registrar tu asistencia y inasistencia de manera fácil y segura.</p>
          </div>
          <div className="card">
            <h2 style={{ fontFamily: 'Arial, sans-serif', fontWeight: 'bold', color: '#8a2036' }}>Información Adicional</h2>
            <p style={{ fontFamily: 'Arial, sans-serif', color: '#000' }}>Consulta tu informacion y gestiona comodamente los datos.</p>
          </div>
          <div className="card">
            <h2 style={{ fontFamily: 'Arial, sans-serif', fontWeight: 'bold', color: '#8a2036' }}>Soporte</h2>
            <br/>
            <p style={{ fontFamily: 'Arial, sans-serif', color: '#000' }}>En caso de tener problemas, <br/> Haz una consulta con el desarrollador de la pagina</p>
          </div>
          <div className="card">
            <h2 style={{ fontFamily: 'Arial, sans-serif', fontWeight: 'bold', color: '#8a2036' }}>Recursos</h2>
            <p style={{ fontFamily: 'Arial, sans-serif', color: '#000' }}> Accede a materiales y recursos útiles para tu aprendizaje.</p>
          </div>
        </div>
      </div>
<footer className="bg-white text-black py-8 border-t border-gray-300">
  <div className="container mx-auto text-center">
    <h2 style={{ marginBottom: '20px', marginRight: '10px' }}>Contáctanos</h2>
    <div className="flex justify-center space-x-6 mb-4">
      <Link to="https://www.facebook.com/somoscecytem" target="_blank" rel="noopener noreferrer" className="InicioS-facebook-link">
        <i className="fab fa-facebook fa-2x"></i>
      </Link>
      <Link to="https://www.instagram.com/somoscecytem/#" target="_blank" rel="noopener noreferrer" className="InicioS-instagram-link">
        <i className="fab fa-instagram fa-2x"></i>
      </Link>
      <Link to="https://x.com/i/flow/login?redirect_after_login=%2Fsomoscecytem" target="_blank" rel="noopener noreferrer" className="InicioS-twitter-link">
        <i className="fab fa-twitter fa-2x"></i>
      </Link>
    </div>
    <p className="mt-4 text-sm" style={{ fontFamily: 'Arial, sans-serif', marginBottom: '24px' }}>© 2025 CECyTEM Plantel Nicolás Romero I. <br/>
    Página Oficial Del Plantel</p>
    <p className="created-by">Created by Jovan Alexander</p>
  </div>
</footer>

    </header>
  );
}

function App() {
  const location = useLocation();

  return (
    <div className="App">
      <Routes>
        <Route path="/auth/login" element={<Login />} />
        <Route path="/auth/register" element={<Register />} />
        <Route path="/auth/profile" element={<Profile />}/>
        <Route path="/auth/settings" element={<Settings />} />
        <Route path='/auth/uploadCSV' element={<UploadCSV />} />
        <Route path="/auth/checkTables" element={<CheckTables />} />
        <Route
          path="/auth/index"
          element={
            <ProtectedRoute>
              <Index />
            </ProtectedRoute>
          }
        />
        <Route
          path="/auth/uploadCSV"
          element={
            <ProtectedRoute>
              <UploadCSV />
            </ProtectedRoute>
          }
        />
        <Route
          path="/auth/checkTables"
          element={
            <ProtectedRoute>
              <CheckTables />
            </ProtectedRoute>
          }
        />
        <Route
          path="/auth/settings"
          element={
            <ProtectedRoute>
              <Settings />
            </ProtectedRoute>
          }
        />
         <Route
          path="/auth/schedules"
          element={
            <ProtectedRoute>
              <Schedules />
            </ProtectedRoute>
          }
        />
        <Route
          path="/auth/Menu"
          element={
            <ProtectedRoute>
              <Menu />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<MainContent />} />
      </Routes>
    </div>
  );
}

export default function AppWithRouter() {
  return (
    <Router>
      <App />
    </Router>
  );
}
