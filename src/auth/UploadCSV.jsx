import React, { useState, useEffect } from "react";
import Papa from "papaparse";
import * as XLSX from "xlsx";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import moment from "moment-timezone";
import API_URL from "../Api";

moment.tz.setDefault('America/Mexico_City');



function UploadCSV() {
  const [error, setError] = useState(null);
  const [file, setFile] = useState(null);
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setError(null);
    setFile(selectedFile);
  };

  const handleUpload = () => {
    if (!file) {
      setError("Selecciona un archivo primero.");
      return;
    }
    const fileName = file.name.toLowerCase();
    if (!(fileName.endsWith(".csv") || fileName.endsWith(".xlsx") || fileName.endsWith(".xls"))) {
      setError("Por favor, selecciona un archivo CSV o Excel (.xlsx, .xls).");
      return;
    }

    if (fileName.endsWith(".csv")) {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: function (results) {
          fetch(`${API_URL}/auth/uploadAsistencias`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ registros: results.data })
          })
            .then(res => res.json())
            .then(data => {
              if (data.success) {
          localStorage.setItem('uploadedFileName', file.name);
          Swal.fire({
            title: "Archivo subido!",
            text: "Registros guardados correctamente",
            icon: "success"
          });
          navigate("/auth/checkTables");
          } else {
            setError("Error al guardar registros");
          }
        })
        .catch(() => setError("Error de conexión con el servidor"));
        },
        error: function () {
          setError("Error al leer el archivo CSV.");
        }
      });
    } else {
      const reader = new FileReader();
      reader.onload = (evt) => {
        const data = new Uint8Array(evt.target.result);
        const workbook = XLSX.read(data, { type: "array" });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { defval: "" });
        fetch(`${API_URL}/auth/uploadAsistencias`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ registros: jsonData })
        })
          .then(res => res.json())
          .then(data => {
            if (data.success) {
              Swal.fire({
                title: "Archivo subido!",
                text: "Registros guardados correctamente",
                icon: "success"
              });
              navigate("/auth/checkTables", { state: { fileName: file.name } });
            } else {
              setError("Error al guardar registros");
            }
          })
          .catch(() => setError("Error de conexión con el servidor"));
      };
      reader.onerror = () => setError("Error al leer el archivo Excel.");
      reader.readAsArrayBuffer(file);
    }
  };

  useEffect(() => {
  const auth = localStorage.getItem("auth");
  if (!auth) {
    navigate("/auth/login", { replace: true });
  }
}, [navigate]);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg,rgb(247, 240, 240) 0%,rgb(250, 247, 247) 100%)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "flex-start",
        paddingTop: 40,
      }}
    >
      <header
        className="InicioS-header"
        style={{
          width: "100%",
          display: "flex",
          justifyContent: "flex-start",
          alignItems: "center",
          background: "#8a2036",
          padding: "16px 32px",
          borderRadius: "0 0 18px 18px",
          marginBottom: 32,
        }}
      >
        <Link
          className="InicioS-link"
          to={"/auth/index"}
        >
          Pagina principal
        </Link>
      </header>
      <div
        style={{
          background: "#fff",
          borderRadius: 18,
          boxShadow: "0 4px 24px rgba(138,32,54,0.08)",
          padding: "40px 32px 32px 32px",
          maxWidth: 420,
          width: "100%",
          margin: "0 auto",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <h1
          style={{
            color: "#8a2036",
            fontWeight: "bold",
            marginBottom: 24,
            fontSize: "2rem",
            letterSpacing: "1px",
            textAlign: "center",
          }}
        >
          Subir archivo CSV o Excel
        </h1>
        <label
          htmlFor="file-upload"
          style={{
            background: "#8a2036",
            color: "#fff",
            padding: "12px 28px",
            borderRadius: 8,
            cursor: "pointer",
            fontWeight: "bold",
            fontSize: "1rem",
            marginBottom: 16,
            transition: "background 0.2s",
            boxShadow: "0 2px 8px rgba(138,32,54,0.08)",
            border: "none",
            display: "inline-block",
          }}
        >
          Elegir archivo
          <input
            id="file-upload"
            type="file"
            accept=".csv,.xlsx,.xls"
            onChange={handleFileChange}
            style={{ display: "none" }}
          />
        </label>
        {file && (
          <div style={{ marginBottom: 16, color: "#8a2036", fontWeight: "bold" }}>
            Archivo seleccionado: <span style={{ color: "#333" }}>{file.name}</span>
          </div>
        )}
        <button
          className="Register-button"
          onClick={handleUpload}
          disabled={!file}
          style={{
            marginTop: 8,
            background: file ? "#8a2036" : "#ccc",
            color: "#fff",
            padding: "12px 32px",
            border: "none",
            borderRadius: 8,
            fontWeight: "bold",
            fontSize: "1.1rem",
            cursor: file ? "pointer" : "not-allowed",
            boxShadow: "0 2px 8px rgba(138,32,54,0.08)",
            transition: "background 0.2s",
          }}
        >
          Subir
        </button>
        {error && (
          <div
            style={{
              color: "#fff",
              background: "#d32f2f",
              padding: "10px 18px",
              borderRadius: 8,
              marginTop: 16,
              fontWeight: "bold",
              textAlign: "center",
              boxShadow: "0 2px 8px rgba(211,47,47,0.08)",
            }}
          >
            {error}
          </div>
        )}
      </div>
    </div>
  );
}

export default UploadCSV;
