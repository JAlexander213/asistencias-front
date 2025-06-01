import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import API_URL from "../Api";

function Register() {
  const [name, setName] = useState("");
  const [user, setUser] = useState("");
  const [password, setPassword] = useState("");
  const [photo, setPhoto] = useState(null);
  const [preview, setPreview] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem("auth") === "true") {
      navigate("/auth/index", { replace: true });
    }
  }, [navigate]);

 const handleSubmit = async (e) => {
  e.preventDefault(); 

  // Quitar espacios al inicio y final
  const trimmedName = name.trim();
  const trimmedUser = user.trim();
  const trimmedPassword = password.trim();

  // Validar que no sean solo espacios
  if (!trimmedName || !trimmedUser || !trimmedPassword) {
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: "Por favor, completa todos los campos sin espacios vacíos.",
    });
    setError("Por favor, completa todos los campos sin espacios vacíos.");
    return;
  }

  // Validar que el nombre solo tenga letras (puedes permitir acentos y espacios entre palabras)
  if (!/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/.test(trimmedName)) {
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: "El nombre solo debe contener letras.",
    });
    setError("El nombre solo debe contener letras.");
    return;
  }

  // Validar usuario: letras o letras+numeros
  if (!/^(?=.*[A-Za-z])[A-Za-z0-9]+$/.test(trimmedUser)) {
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: "El usuario debe contener letras y puede tener números, pero no solo números ni espacios.",
    });
    setError("El usuario debe contener letras y puede tener números, pero no solo números ni espacios.");
    return;
  }

  // Validar contraseña: sin espacios, mínimo 3 caracteres
  if (/\s/.test(trimmedPassword)) {
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: "La contraseña no debe contener espacios.",
    });
    setError("La contraseña no debe contener espacios.");
    return;
  }
  if (trimmedPassword.length < 3) {
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: "La contraseña debe tener al menos 3 caracteres.",
    });
    setError("La contraseña debe tener al menos 3 caracteres.");
    return;
  }

  setError(null);
  setLoading(true);
  try {
    const formData = new FormData();
    formData.append("username", trimmedUser);
    formData.append("password", trimmedPassword);
    formData.append("name", trimmedName);
    formData.append("photo", photo);

    const response = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      body: formData, 
    }); 
    const data = await response.json();

    if (data.error) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: data.error,
      });
      setError(data.error);
    } else if (!response.ok) {
      setError(data.error || "Error al registrar");
    } else {
      setSuccess("¡Registro exitoso!");
      localStorage.setItem("auth", "true");
      localStorage.setItem("username", data.username);
      Swal.fire({
        title: "Registro exitoso!",
        text: "Bienvenido " + data.name,
        icon: "success"
      });
      navigate("/auth/index", { replace: true });
    }
  } catch (error) {
    setError("Error de conexión con el servidor");
  } finally {
    setLoading(false);
  }
};

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    setPhoto(file);
    if (file) {
      setPreview(URL.createObjectURL(file));
    } else {
      setPreview("");
    }
  };

  return (
    <>
      <header className="InicioS-header">
        <Link className="InicioS-link3" to="/auth/login">
          Inicio de sesion
        </Link>
      </header>
      <div className="App-logo">
        <img
          src="https://cecytem.edomex.gob.mx/themes/seitheme3/logo.svg"
          className="App-logo"
          alt="logo"
        />
      </div>
      <br />
      <br />
      <h3 className="Login-Cecytem">
        Cecytem Plantel Nicolas Romero 1
      </h3>
      <div className="App-Content1">
        <h1 className="App-title">Registro</h1>
  <label style={{ fontWeight: "bold", color: "#8a2036" }}>Foto de perfil:</label>

        {preview && (
          <img
            src={preview}
            style={{
              borderRadius: "50%",
              width: "120px",
              height: "120px",
              objectFit: "cover",
              border: "4px solidrgb(255, 250, 251)",
              boxShadow: "0 4px 16px rgba(138,32,54,0.15)",
              margin: "12px auto 16px auto",
              display: "block",
              background: "#fff"
            }}
            alt="Foto de perfil seleccionada"
          />
        )}
      </div>

        {loading && (
  <div style={{
    display: "flex", justifyContent: "center", alignItems: "center", margin: "20px"
  }}>
    <div style={{
      border: "4px solid #f3f3f3",
      borderTop: "4px solid #8a2036",
      borderRadius: "50%",
      width: "40px",
      height: "40px",
      animation: "spin 1s linear infinite"
    }} />
    <style>
      {`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}
    </style>
  </div>
)}

      <form
        onSubmit={handleSubmit}
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "16px",
          width: "100%",
          maxWidth: "400px",
          margin: "0 auto",
        }}
      >
        <div style={{ width: "100%" }}>
  <br />
  <label
    htmlFor="file-upload"
    className="upload-button"
  >
    Elegir archivo
  </label>
  <input
    id="file-upload"
    type="file"
    accept="image/*"
    onChange={handlePhotoChange}
    style={{ display: "none" }}
  />
  {photo && (
    <span style={{ marginLeft: "12px", color: "#8a2036", fontSize: "0.95rem" }}>
      {photo.name}
    </span>
  )}
</div>
        <div style={{ position: "relative", width: "100%" }}>
          <i
            className="ion-person"
            style={{
              position: "absolute",
              left: 12,
              top: "50%",
              transform: "translateY(-50%)",
              fontSize: "1.2rem",
              color: "#8a2036",
              pointerEvents: "none"
            }}
          ></i>
          <input
            type="text"
            placeholder="Nombre completo"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={{
              padding: "10px 10px 10px 36px",
              borderRadius: "20px",
              border: "1px solid #8a2036",
              fontSize: "1rem",
              width: "100%",
              boxSizing: "border-box",
            }}
          />
        </div>
        <div style={{ position: "relative", width: "100%" }}>
          <i
            className="ion-person-stalker"
            style={{
              position: "absolute",
              left: 12,
              top: "50%",
              transform: "translateY(-50%)",
              fontSize: "1.2rem",
              color: "#8a2036",
              pointerEvents: "none"
            }}
          ></i>
          <input
            type="text"
            placeholder="Usuario"
            value={user}
            onChange={(e) => setUser(e.target.value)}
            style={{
              padding: "10px 10px 10px 36px",
              borderRadius: "20px",
              border: "1px solid #8a2036",
              fontSize: "1rem",
              width: "100%",
              boxSizing: "border-box",
            }}
          />
        </div>
        <div style={{ position: "relative", width: "100%" }}>
          <i
            className="ion-locked"
            style={{
              position: "absolute",
              left: 12,
              top: "50%",
              transform: "translateY(-50%)",
              fontSize: "1.2rem",
              color: "#8a2036",
              pointerEvents: "none"
            }}
          ></i>
          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{
              padding: "10px 10px 10px 36px",
              borderRadius: "20px",
              border: "1px solid #8a2036",
              fontSize: "1rem",
              width: "100%",
              boxSizing: "border-box",
            }}
          />
        </div>
        {error && (
          <span style={{ color: "#8a2036", fontSize: "0.95rem" }}>{error}</span>
        )}
      <button
        className="Register-button"
        type="submit"
        disabled={loading}
        >
        {loading ? "Registrando..." : "Registrar"}
      </button>
      </form>
    </>
  );
}

export default Register;