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
      <div className="Lottie-separator">
        <DotLottieReact
          src="https://lottie.host/420891a3-82b3-4cd4-a48d-1921f6703134/etGRfYNbfi.lottie"
          width={25}
          height={25}
          loop
          autoplay
          className='App-Animation'
        />
      </div>
      <h3 className='App-Cecytem'>Colegio de Estudios Cientificos Y Tecnologicos Del Estado de Mexico</h3>

      <div className='App-logo'>
        <img src="https://cecytem.edomex.gob.mx/themes/seitheme3/logo.svg" className="App-logo" alt="logo"></img>
      </div>
      <br/>
      <div className='App-Content1'>
        <h1 className="App-title">Sistema de Control de Actividades</h1>
        
        <div className="grid-container">
          <div className="card">
            <h2>Bienvenido</h2>
            <p>Al sistema de asistencia e inasistencia del Colegio de Estudios Cientificos Y Tecnologicos Del Estado de Mexico.</p>
            <p>Aquí podrás registrar tu asistencia y inasistencia de manera fácil y segura.</p>
          </div>
          <div className="card">
            <h2>Información Adicional</h2>
            <p>Consulta tus registros de asistencia y mantente al día con tus actividades.</p>
          </div>
          <div className="card">
            <h2>Soporte</h2>
            <p>Si tienes alguna duda, no dudes en contactarnos a través de nuestras redes sociales.</p>
          </div>
          <div className="card">
            <h2>Recursos</h2>
            <p>Accede a materiales y recursos útiles para tu aprendizaje.</p>
          </div>
        </div>
      </div>
<footer className="bg-white text-black py-8 border-t border-gray-300">
  <div className="container mx-auto text-center">
    <h2 className="text-2xl font-bold mb-4">Contáctanos</h2>
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
    <p className="mt-4 text-sm">© 2025 Colegio de Estudios Científicos y Tecnológicos del Estado de México. Todos los derechos reservados.</p>
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
