import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import login from "../img/login.png";
import API_URL from "../Api";

function Login() {
  const [user, setUser] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(false); // <-- NUEVO
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem("auth") === "true") {
      navigate("/auth/index", { replace: true });
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user || !password) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Por favor, completa todos los campos.",
      });
      setError("Por favor, completa todos los campos.");
      return;
    }
    if (user.length < 3) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "El usuario debe tener al menos 3 caracteres.",
      });
      setError("El usuario debe tener al menos 3 caracteres.");
      return;
    }
    if (password.length < 3) {
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
      const response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: user,
          password: password,
        }),
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
        setError(data.error || "Error al iniciar sesión");
      } else {
        setSuccess("Inicio de sesión exitoso!");
        localStorage.setItem("username", user);
        setUser("");
        setPassword("");
        Swal.fire("Bienvenido de nuevo " + user);
        localStorage.setItem("auth", "true");
        navigate("/auth/index", { replace: true });
      }
    } catch (error) {
      setError("Error de conexión con el servidor");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <header className="InicioS-header">
        <Link className="InicioS-link3" to="/src/App.js">
          Regresar
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
      <h3 className="Login-Cecytem">Cecytem Plantel Nicolas Romero 1</h3>
      <div className="App-Content1">
        <h1 className="App-title">Iniciar Sesión</h1>
        <img
          src={login}
          style={{
            borderRadius: "50%",
            position: "static",
            width: "100px",
            height: "100px",
            objectFit: "fill",
          }}
          alt="Registro"
        />
        <br />

        {loading && (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              margin: "20px",
            }}
          >
            <div
              style={{
                border: "4px solid #f3f3f3",
                borderTop: "4px solid #8a2036",
                borderRadius: "50%",
                width: "40px",
                height: "40px",
                animation: "spin 1s linear infinite",
              }}
            />
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
                pointerEvents: "none",
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
                pointerEvents: "none",
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
            <span style={{ color: "#8a2036", fontSize: "0.95rem" }}>
              {error}
            </span>
          )}
          <button type="submit" className="Login-button">
            Entrar
          </button>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              marginTop: "8px",
            }}
          >
            <span>¿Aún no tienes una cuenta?</span>
            <Link
              to="/auth/register"
              style={{
                fontSize: "1.2rem",
                color: "#8a2037",
                fontWeight: "bold",
                textDecoration: "none",
              }}
            >
              Registrarse
            </Link>
          </div>
        </form>
      </div>
    </>
  );
}

export default Login;