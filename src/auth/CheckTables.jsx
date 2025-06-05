import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { useNavigate, Link } from "react-router-dom";
import NF from "./../img/NF.png";
import API_URL from "../Api";
import { DateTime } from "luxon";

function CheckTables() {
  const [registros, setRegistros] = useState([]);
  const [mostrarTabla, setMostrarTabla] = useState(false); 
  const [error, setError] = useState(null);
  const [profesores, setProfesores] = useState([]);
  const [filtroProfesor, setFiltroProfesor] = useState("");
  const [archivosSubidos, setArchivosSubidos] = useState([]);
  const [archivoSeleccionado, setArchivoSeleccionado] = useState(null);
  const [busqueda, setBusqueda] = useState("");

  const navigate = useNavigate();

  // Cargar datos iniciales
  useEffect(() => {
    const auth = localStorage.getItem("auth");
    if (!auth) {
      navigate("/auth/login", { replace: true });
      return;
    }

    cargarDatosIniciales();
  }, [navigate]);

  const cargarDatosIniciales = async () => {
    try {
      // Cargar lista de archivos
      const resArchivos = await fetch(`${API_URL}/auth/asistencias/archivos`);
      const dataArchivos = await resArchivos.json();
      setArchivosSubidos(dataArchivos.map(archivo => ({ name: archivo })));

      // Cargar profesores
      const resProfesores = await fetch(`${API_URL}/auth/asistencias`);
      const dataProfesores = await resProfesores.json();
      
      if (Array.isArray(dataProfesores)) {
        const nombresUnicos = [...new Set(
          dataProfesores
            .map(r => r.nombre)
            .filter(nombre => typeof nombre === "string" && nombre.trim() !== "")
        )];
        setProfesores(nombresUnicos);
      }
    } catch (err) {
      setError("Error al cargar datos iniciales");
    }
  };

  const cargarRegistros = async () => {
    let timerInterval;
  try {
    Swal.fire({
      title: "Cargando...",
      html: "Se está cargando el archivo. Por favor espere.",
      showLoading: true,
      timerProgressBar: true,
      didOpen: () => {
        Swal.showLoading();
      },
      willClose: () => {
        clearInterval(timerInterval);
      }
    });

    let url = `${API_URL}/auth/asistencias`;
    if (archivoSeleccionado) {
      url = `${API_URL}/auth/asistencias/${encodeURIComponent(archivoSeleccionado)}`;
    }

    const res = await fetch(url);
    const data = await res.json();

    if (Array.isArray(data)) {
      setRegistros(data);
      setMostrarTabla(true);
    } else {
      setError("Formato de datos inválido");
    }
  } catch (err) {
    setError("Error al cargar registros");
  } finally {
    Swal.close();
  }
};

  const handleDelete = async () => {
  const result = await Swal.fire({
    title: '¿Estás seguro?',
    text: 'Se eliminarán todos los registros. Esta acción no se puede deshacer.',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
    confirmButtonText: 'Sí, eliminar todo',
  });

  if (result.isConfirmed) {
    try {
      const res = await fetch(`${API_URL}/auth/asistencias/delete/${encodeURIComponent(archivoSeleccionado)}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' }
      });
      if (res.ok) {
        Swal.fire('Eliminado', 'Se eliminaron ' + registros.length + ' registros del archivo ' + archivoSeleccionado, 'true', 'success');
        setRegistros([]);
        setMostrarTabla(false);
      } else {
        throw new Error('Error al eliminar registros');
      }
    } catch (error) {
      Swal.fire('Error', 'No se pudieron eliminar los registros.', 'error');
    }
  }
};

const registrosFiltrados = registros.filter(registro => {
  const cumpleArchivo = !archivoSeleccionado || registro.archivo === archivoSeleccionado;
  const cumpleProfesor = !filtroProfesor || 
    registro.nombre?.toLowerCase().includes(filtroProfesor.toLowerCase());
  const cumpleBusqueda = !busqueda || 
    Object.values(registro).some(val => 
      String(val).toLowerCase().includes(busqueda.toLowerCase())
    );
  return cumpleArchivo && cumpleProfesor && cumpleBusqueda;
});

const columns = registros[0]
  ? Object.keys(registros[0]).filter(col => col !== "fecha_hora_formateada")
  : [];



if (error) {
  return (
    <div style={{ padding: 32 }}>
      <h1>Error</h1>
      <p>{error}</p>
      <button onClick={cargarDatosIniciales} className="Login-Cecytem">Reintentar</button>
    </div>
  );
}

// Caso: no hay archivos cargados
if (!archivosSubidos.length) {
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
        <p style={{ fontSize: "1.5rem", color: "rgb(0, 0, 0)", fontWeight: "bold" }}>
          No hay archivos cargados aún
        </p>
        <img src={NF} alt="No hay archivos" style={{ width: "400px", borderRadius: "50%" }} />
      </div>
    </>
  );
}

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
    {/* Selector de archivo */}
    <div style={{ margin: "20px 0" }}>
      <h3 style={{ color: "#8a2036" }}>Archivos subidos:</h3>
      <br />
      <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", marginBottom: "20px" }}>
        <select 
          className="select-archivo"
          value={archivoSeleccionado}
          onChange={(e) => {
            setArchivoSeleccionado(e.target.value);
            setMostrarTabla(false); 
          }}
        >
          <option value="">Selecciona tu archivo</option>
          {archivosSubidos.map((archivo) => (
            <option key={archivo.name} value={archivo.name} className="archivosU-button">
              {archivo.name}
            </option>
          ))}
        </select>
      </div>
    </div>

    {/* Si no hay archivo seleccionado, mostramos imagen de "No hay registros" y no mostramos botón ni tabla */}
    {!archivoSeleccionado && (
      <div style={{ padding: 32 }}>
        <p style={{ fontSize: "1.5rem", color: "rgb(0, 0, 0)", fontWeight: "bold" }}>
          Selecciona un archivo para ver registros
        </p>
        <img src={NF} alt="No seleccionado" style={{ width: "400px", borderRadius: "50%" }} />
      </div>
    )}

    {/* Solo mostrar filtros, botón y tabla si hay archivo seleccionado */}
    {archivoSeleccionado && (
      <>
        {/* Filtros y búsqueda */}
        <div style={{ marginBottom: "20px", display: "flex", flexWrap: "wrap", gap: "15px" }}>
          <div>
            <label style={{ marginRight: "8px", fontWeight: "bold", color: "#8a2036" }}>
              Filtrar por profesor:
            </label>
            <select
              value={filtroProfesor}
              onChange={(e) => setFiltroProfesor(e.target.value)}
              style={{ 
                padding: "8px", 
                borderRadius: "20px", 
                border: "1px solid #d85353",
                backgroundColor: "#fff"
              }}
            >
              <option value="">Todos los profesores</option>
              {profesores.map((nombre, idx) => (
                <option key={idx} value={nombre}>{nombre}</option>
              ))}
            </select>
          </div>

          <div>
            <label style={{ marginRight: "8px", fontWeight: "bold", color: "#8a2036" }}>
              Buscar:
            </label>
            <input
              type="text"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              placeholder="Buscar en registros..."
              style={{ 
                padding: "8px", 
                borderRadius: "20px", 
                border: "1px solid #d85353",
                width: "250px"
              }}
            />
          </div>

          <button
            className="Delete-button"
            onClick={() => {
              setFiltroProfesor("");
              setBusqueda("");
            }}
            disabled={!filtroProfesor && !busqueda}
          >
            Limpiar filtros
          </button>

          {/* Botón eliminar solo si tabla visible y registros filtrados */}
          {mostrarTabla && registrosFiltrados.length > 0 && (
            <button 
              className="Delete-button" 
              onClick={handleDelete}
              style={{ marginLeft: "auto" }}
            >
              <i className="fa fa-trash"></i> Eliminar archivo {archivoSeleccionado}
            </button>
          )}
        </div>

        {/* Botón para mostrar/ocultar tabla */}
        <button
          className="Register-button"
          onClick={() => {
            if (!mostrarTabla) {
              cargarRegistros(); 
            } else {
              setMostrarTabla(false);
            }
          }}
          style={{ marginBottom: "20px" }}
        >
          {mostrarTabla ? "Ocultar tabla" : "Mostrar registros"}
        </button>

        {/* Mostrar tabla o mensaje si no hay registros filtrados */}
        {mostrarTabla && (
          registrosFiltrados.length > 0 ? (
            <div style={{ overflowX: "auto" }}>
              <p style={{ fontWeight: "bold", color: "#8a2036" }}>
                Mostrando {registrosFiltrados.length} registros del archivo: {archivoSeleccionado}
              </p>

              <table style={{ 
                borderCollapse: "collapse", 
                width: "100%",
                margin: "20px 0",
                boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
              }}>
                <thead>
                  <tr>
                    {columns.map((col) => (
                      <th
                        key={col}
                        style={{
                          border: "1px solid #8a2036",
                          padding: "12px",
                          background: "#f7eaea",
                          color: "#8a2036",
                          textAlign: "left"
                        }}
                      >
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {registrosFiltrados.map((row, idx) => (
                    <tr key={idx} style={{ background: idx % 2 === 0 ? "#fff" : "#f9f9f9" }}>
                      {columns.map((col) => (
                        <td
                          key={col}
                          style={{
                            border: "1px solid #ddd",
                            padding: "12px",
                          }}
                        >
                          {col === "fecha_hora"
  ? DateTime.fromISO(row[col], { zone: "utc" }).toFormat("yyyy-MM-dd HH:mm")
  : row[col] || "-"}

                        </td>
                       
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
              
              <button
                className="Register-button"
                onClick={() => setMostrarTabla(false)}
                style={{ marginTop: "10px" }}
              >
                Cerrar tabla
              </button>
            </div>
          ) : (
            <div style={{ padding: 32 }}>
              <h1 className="Login-Cecytem" style={{ marginTop: "-80px" }}>Registros</h1>
              <p style={{ fontSize: "1.5rem", color: "rgb(0, 0, 0)", fontWeight: "bold" }}>
                No hay registros para el archivo seleccionado
              </p>
              <img src={NF} alt="No hay registros" style={{ width: "400px", borderRadius: "50%" }} />
            </div>
          )
        )}
      </>
    )}
  </div>
);

}

export default CheckTables;