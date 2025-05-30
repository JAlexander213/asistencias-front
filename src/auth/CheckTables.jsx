import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { useNavigate, Link, useLocation } from "react-router-dom";
import NF from "./../img/NF.png";

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
    fetch("http://localhost:3001/auth/asistencias")
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
          setProfesores(nombresUnicos);  // Cambiar a 'setProfesores'

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
          <p style={{ fontSize: "1.5rem", color: "rgb(189, 72, 72)", fontFamily: "cursive" }}>
            No hay registros actualmente
          </p>
          <span style={{ fontSize: "1.1rem", fontFamily: "sans-serif", fontWeight: "bold", color: "rgb(219, 90, 90)" }}>
            ¡Sé el primero en subir un archivo!
          </span>
          <br />
          <img src={NF} alt="Not found" style={{ width: "400px", borderRadius: "50%" }} />
        </div>
      </>
    );
  }

const columns = Object.keys(registros[0]).filter(col => col !== "fecha_hora" &&  "fecha_hora_formateada");


  const handleDelete = () => {
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'Esto eliminará todos los registros de asistencias.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        fetch('http://localhost:3001/auth/asistencias/delete', { method: 'DELETE' })
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
    });
  };

  // Filtra los registros por profesor
  const registrosFiltrados = filtroProfesor
    ? registros.filter(r => r.nombre === filtroProfesor)  // Cambiar a 'Profesor'
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
          style={{ marginRight: 8, padding: 8, borderRadius: 20, border: "1px solid #ccc", borderColor: "rgb(216, 83, 83)", backgroundColor:  "rgb(255, 255, 255)", color: "rgb(0, 0, 0)" }}
          onChange={(e) => setFiltroProfesor(e.target.value)}
        >
          <option value="">Mostrar todos</option>

          <option value=""> Profesores esta quincena: { profesores.length}</option>
          {profesores.map((nombre, idx) => (
            <option key={idx} value={nombre}>

              {nombre}
            </option>
          ))}
        </select>

        {filtroProfesor && (
          <button
            style={{ marginLeft: 8, marginTop:8 }}
            className="Delete-button"
            onClick={() => setFiltroProfesor("")}
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

      {mostrarTabla && (
        <>
          <button
            className="Login-button"
            onClick={() => setMostrarTabla(false)}
          >
            <i className="fa fa-close" style={{ marginRight: 8 }}></i>
            Cerrar
          </button>
          <br />
          <br />
          <div style={{ overflowX: "auto", marginBottom: 16 }}>
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
          </div>
          <button
            className="Register-button"
            onClick={() => setMostrarTabla(false)}
          >
            Cerrar
          </button>
        </>
      )}
    </div>
  );
}

export default CheckTables;