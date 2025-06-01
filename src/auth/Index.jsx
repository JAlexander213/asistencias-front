import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import API_URL from "../Api";
import vacio from "../img/vacio.png";
function Index() {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef();

  const [user, setUser] = useState(null);
  const [name, setName] = useState("");
  const [photo, setPhoto] = useState(null);

    useEffect(() => {
      const usernameLS = localStorage.getItem("username");
      fetch(`${API_URL}/auth/profile?username=${usernameLS}`)
        .then(res => res.json())
        .then(data => {
          setUser(data);
          setName(data.name);
          setPhoto(data.photo);
        })
        .catch(() => setUser(null));
    }, []);
  useEffect(() => {
    const handlePopState = () => {
      if (
        window.location.pathname === "/auth/login" ||
        window.location.pathname === "/auth/register"
      ) {
        navigate("/auth/index", { replace: true });
      }
    };
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [navigate]);

  // Cierra el menú si se da click fuera
  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {

const swalWithBootstrapButtons = Swal.mixin({
  customClass: {
    confirmButton: "confirmar-button",
    cancelButton: "cancelar-button"
  },
  buttonsStyling: false
});
swalWithBootstrapButtons.fire({
  title: "Estas seguro de salir?",
  text: "Te tendras que volver a registrar",
  icon: "warning",
  showCancelButton: true,
  confirmButtonText: "Si, cerrar sesion",
  cancelButtonText: "No, cancelar",
}).then((result) => {
  if (result.isConfirmed) {
    swalWithBootstrapButtons.fire({
      title: "Has cerrado sesion",
      text: "Vuelve pronto",
      icon: "success"
    });
    localStorage.removeItem("auth");
    window.location.replace("/auth/login");

  } else if (
    result.dismiss === Swal.DismissReason.cancel
  ) {
    swalWithBootstrapButtons.fire({
      title: "No has cerrado sesion",
      text: "Gracias por permanecer aqui :)",
      icon: "error"
    });
  }
});
  };

  const CheckTables= () => {
    navigate("/auth/checkTables", { replace: true });
  }

  return (
    <>
    <header className="InicioS-header" style={{ display: "flex", justifyContent: "flex-end", alignItems: "center", padding: "10px 20px" }}>
    
  <div style={{ position: "relative" }} ref={menuRef}>
    <i
      className="ion-navicon-round"
      style={{
        fontSize: "2.2rem",
        color: "rgb(247, 193, 193)", 
        cursor: "pointer",
        transition: "color 0.2s"
      }}
      onClick={() => setMenuOpen((open) => !open)}
      title="Opciones"
    ></i>
    {menuOpen && (
      <div
        style={{
          position: "fixed",
          top: "3.5rem",
          right: 0,
          background: "#fff",
          border: "1px solid #ddd",
          borderRadius: "10px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
          minWidth: "150px",
          zIndex: 100
        }}
      >
        <div className="accountI-button">

        <button
          style={{
            width: "100%",
            padding: "10px 16px",
            background: "none",
            border: "none",
            textAlign: "left",
            cursor: "pointer",
            fontSize: "1rem",
            display: "flex",
            alignItems: "center",
            gap: "8px"
          }}
          onClick={() => {
            setMenuOpen(false);
            navigate("/auth/profile");
          }}
        >
             <i className="ion-person" style={{ fontSize: "1.2rem", color: "#111" }}></i>
          Mi cuenta
        </button>
        </div>
          
          <div className="uploadCSV-button">
          <button
          style={{
            width: "100%",
            padding: "10px 16px",
            background: "none",
            border: "none",
            textAlign: "left",
            cursor: "pointer",
            fontSize: "1rem",
            display: "flex",
            alignItems: "center",
            gap: "8px"
          }}
          onClick={() => {
            setMenuOpen(false);
            navigate("/auth/uploadCSV");
          }}
        >
          <i className="ion-upload" style={{ fontSize: "1.2rem", color: "#111" }}></i>
          Subir archivo CSV
        </button>
          </div>

          <div className="ajustes-button">
        <button
          style={{
            width: "100%",
            padding: "10px 16px",
            background: "none",
            border: "none",
            textAlign: "left",
            cursor: "pointer",
            fontSize: "1rem",
            display: "flex",
            alignItems: "center",
            gap: "8px"
          }}
          onClick={() => {
            setMenuOpen(false);
            navigate("/auth/settings");
          }}
        >
          <i className="ion-wrench" style={{ fontSize: "1.2rem", color: "#111" }}></i>
          Ajustes
        </button>
          </div>

          <div className="cerrar-sesion-button">
        <button
        className="cerrarText-sesion-button"
          onClick={handleLogout}
        >
          <i className="ion-log-out" style={{ fontSize: "1.2rem", color: "#fff" }}></i>
          Cerrar sesión
        </button>
          </div>
      </div>
    )}
  </div>
</header>

  
  <div style={{  marginTop: "14vh", marginBottom: "-10vh",display: "flex", alignItems: "center", gap: "10px" }}>
    <img 
    src={photo}
      style={{ width: 60, height: 60, borderRadius: "50%", objectFit: "cover" }}
        onLoad={(e) => {
        e.target.src = photo; 
        }}
      onError={(e) => {
        e.target.src = {vacio}; 
      }}
      />
    
    <span style={{ fontWeight: "bold", color: "#8a2036", fontSize: "1.2rem"}}>{name}</span>
  </div>
      <h3 className="Login-Cecytem">
        Sistema de Gestión de Actividades Extracurriculares
      </h3>
    <button className="Check-button" onClick={CheckTables}>Gestionar entradas y salidas</button>
      
    </>
  );
}

export default Index;