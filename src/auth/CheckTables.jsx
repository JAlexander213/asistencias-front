import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { useNavigate, Link, useLocation } from "react-router-dom";
import NF from "./../img/NF.png";
import API_URL from "../Api";
function CheckTables() {
  const [registros, setRegistros] = useState([]);
  const [mostrarTabla, setMostrarTabla] = useState(false);
  const [error, setError] = useState(null);
  const [profesores, setProfesores] = useState([]);  // ← lista de nombres únicos
  const [filtroProfesor, setFiltroProfesor] = useState("");  // ← nombre seleccionado

  const navigate = useNavigate();
  const location = useLocation();
  const fileName = location.state?.fileName;

  useEffect(() => {
    fetch(`${API_URL}/auth/asistencias`)
      .then(res => res.json())
      .then(data => {
        console.log("Datos recibidos del backend:", data);
        if (Array.isArray(data)) {
          setRegistros(data);

          const nombresUnicos = [...new Set(
            data
              .map(r => r.nombre) 
              .filter(nombre => typeof nombre === "string" && nombre.trim() !== "")
          )];
          setProfesores(nombresUnicos);  
        } else {
          setError("No se pudieron cargar los registros");
        }
      })
      .catch(() => setError("Error de conexión con el servidor"));
  }, []);


  if (error) {
    return (
      <div style={{ padding: 32 }}>
        <h1>Error</h1>
        <p>{error}</p>
      </div>
    );
  }

  if (!registros.length) {
    return (
      <>
        <header className="InicioS-header">
          <Link className="InicioS-link2" to={"/auth/index"}>
            Pagina principal
          </Link>
          <Link className="InicioS-link" to={"/auth/uploadCSV"}>
            Subir archivo
          </Link>
        </header>
        <div style={{ padding: 32 }}>
          <h1 className="Login-Cecytem" style={{ marginTop: "-80px" }}>Registros</h1>
          <br />
          <p style={{ fontSize: "1.5rem", color: "rgb(0, 0, 0)", fontFamily: "cursive" }}>
            No hay registros actualmente
          </p>
          <span style={{ fontSize: "1.1rem", fontFamily: "sans-serif", fontWeight: "bold", color: "rgb(43, 42, 42)" }}>
            ¡Sé el primero en subir un archivo!
          </span>
          <br />
          <img src={NF} alt="Not found" style={{ width: "400px", borderRadius: "50%" }} />
        </div>
      </>
    );
  }

const columns = Object.keys(registros[0]).filter(col => col !== "fecha_hora" &&  "fecha_hora_formateada");


  const handleDelete = async () => {
  const { value: passwordInput } = await Swal.fire({
    title: "Confirma tu contraseña",
    input: "password",
    inputLabel: "Introduce tu contraseña actual para eliminar el registro",
    inputAttributes: {
      autocapitalize: "off",
      autocorrect: "off",
      autocomplete: "current-password",
    },
    showCancelButton: true,
    confirmButtonText: "Ingresar",
    cancelButtonText: "Cancelar",
    background: "#fff",
    customClass: {
      input: "password-button",
      inputLabel: "password-label",
      confirmButton: "confirmar-button",
      cancelButton: "cancelar-button",
      title: "title-alert",
    }
    
  });

  if (!passwordInput) return;

  // Verifica la contraseña con el backend
  const usernameLS = localStorage.getItem("username");
  const res = await fetch(`${API_URL}/auth/profile/verify-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username: usernameLS, password: passwordInput })
  });
  const data = await res.json();
  if (!data.success) {
    Swal.fire("Error", "Contraseña incorrecta", "error");
    return; // si es incorrecta
  }

  Swal.fire({
    title: '¿Estás seguro?',
    text: 'Esto eliminará todos los registros de asistencias.',
    icon: 'question',
    showCancelButton: true,
    confirmButtonText: 'Sí, eliminar',
    cancelButtonText: 'Cancelar',

    customClass: {
      confirmButton: "confirmar-button",
      cancelButton: "cancelar-button",
    }

  }).then((result) => {
    if (result.isConfirmed) {
      fetch(`${API_URL}/auth/asistencias/delete`, { method: 'DELETE' })
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            Swal.fire('Eliminado', data.message, 'success');
            setRegistros([]);
            setMostrarTabla(false);
          } else {
            Swal.fire('Error', 'No se pudieron eliminar los registros', 'error');
          }
        })
        .catch(() => {
          Swal.fire('Error', 'Error de conexión con el servidor', 'error');
        });
    }
    else{
      Swal.fire('Cancelado', 'Los registros no fueron eliminados', 'error');
    }
  });
};

  // Filtra los registros por profesor
const registrosFiltrados = filtroProfesor
  ? registros.filter(r => r.nombre.toLowerCase().includes(filtroProfesor.toLowerCase()))
  : registros;

  return (
    <div style={{ padding: 32 }}>
      <header className="InicioS-header">
        <Link className="InicioS-link2" to={"/auth/index"}>
          Pagina principal
        </Link>
        <Link className="InicioS-link" to={"/auth/uploadCSV"}>
          Subir archivo
        </Link>
      </header>
      <h1 className="Login-Cecytem" style={{ marginTop: "-80px" }}>
        Registro de asistencias
      </h1>
      <br />
      <br />
      {/* Select para elegir profesor */}
      <div>
        <label style={{ marginRight: 8, fontSize: "1.1rem", fontWeight: "bold", color: "#8a2036" }}>Filtrar por profesor:</label>
        <select
          value={filtroProfesor}
          style={{ marginRight: 140, padding: 8, borderRadius: 20, border: "1px solid #ccc", borderColor: "rgb(216, 83, 83)", backgroundColor:  "rgb(255, 255, 255)", color: "rgb(0, 0, 0)" }}
          onChange={(e) => setFiltroProfesor(e.target.value)}
        >
          <option value="">Mostrar todos</option>

          {profesores.map((nombre, idx) => (
            <option key={idx} value={nombre}>

              {nombre}
            </option>
          ))}
        </select>
        <br />
        <br />
        <label htmlFor="buscar" style={{ marginRight: 8, fontSize: "1.1rem", fontWeight: "bold", color: "#8a2036" }}>Buscar</label>
        <input
          placeholder="Ingrese el nombre"
          type="text"
          id="buscar"
          style={{ marginRight: 10, padding: 8, borderRadius: 20, border: "1px solid #ccc", borderColor: "rgb(216, 83, 83)", backgroundColor:  "rgb(255, 255, 255)", color: "rgb(0, 0, 0)" }}
        />
        <button onClick={() => {
          setFiltroProfesor(document.getElementById("buscar").value)
          setMostrarTabla(true)
          }}  
          className="Login-button"
          >Buscar</button>

        {filtroProfesor && (
          <button
            style={{ marginLeft: 8, marginTop:8 }}
            className="Delete-button"
            onClick={() => {
              setFiltroProfesor("")
              input: document.getElementById("buscar").value = "";
            }}
          >
            Limpiar filtro
          </button>
        )}
      </div>
      <br />

      {!mostrarTabla && (
        <button
          className="Register-button"
          style={{ marginRight: 10 }}
          onClick={() => setMostrarTabla(true)}
        >
          {fileName || "Mostrar registros"}
        </button>
      )}

      <button className="Delete-button" onClick={handleDelete}>
        <i className="fa fa-trash"></i> Eliminar todo
      </button>
      <br />
      <br />


{mostrarTabla && registrosFiltrados.length > 0 && (
  <div style={{ overflowX: "auto", marginBottom: 16 }}>
    <p style={{ fontSize: "1.1rem", fontWeight: "bold", color: "#8a2036" }}> {registrosFiltrados.length} resultados</p>
     <button
            className="Register-button"
            onClick={() => setMostrarTabla(false)}
          >
            Cerrar
          </button>
      <br />
      <br />
    <table style={{ borderCollapse: "collapse", width: "100%" }}>
      <thead>
        <tr>
          {columns.map((col) => (
            <th
              key={col}
              style={{
                border: "1px solid #8a2036",
                padding: "8px",
                background: "#f7eaea",
                color: "#8a2036"
              }}
            >
              {col}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        
        {registrosFiltrados.map((row, idx) => (
          <tr key={idx}>
            {columns.map((col) => (
              <td
                key={col}
                style={{
                  border: "1px solid #ddd",
                  padding: "8px",
                  background: "#fff"
                }}
              >
                {row[col]}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
     <button
            className="Register-button"
            onClick={() => setMostrarTabla(false)}
          >
            Cerrar
          </button>
  </div>
)}

{mostrarTabla && registrosFiltrados.length === 0 && filtroProfesor !== "" && (
    <p style={{ color: "#666" }}>
      Lo sentimos, pero no se encontró el profesor {filtroProfesor} en la lista de registros.
    </p>
)}
    </div>
  );
}

export default CheckTables;