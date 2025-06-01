import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

function Settings() {
  // Lee el tema guardado en localStorage o usa claro por defecto
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");

  const navigate= useNavigate();
  useEffect(() => {
    // Aplica la clase al body según el tema
    document.body.classList.toggle("dark-theme", theme === "dark");
    document.body.classList.toggle("light-theme", theme === "light");
  }, [theme]);

  const handleThemeChange = (e) => setTheme(e.target.value);

  const handleSave = () => {
    localStorage.setItem("theme", theme);
    document.body.classList.toggle("dark-theme", theme === "dark");
    document.body.classList.toggle("light-theme", theme === "light");
    alert("¡Ajustes guardados!");
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
        background: "transparent",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        paddingTop: 40,
      }}
    >
      <header
        className="InicioS-header"
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
          background: "var(--card-bg)",
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
        <h3
          style={{ color: "var(--main-color)", fontWeight: "bold", fontSize: "1.5rem", marginBottom: 28 }}
        >
          Ajustes de la aplicación
        </h3>

        {/* Selector de tema */}
        <div style={{ marginBottom: 28, width: "100%" }}>
          <label style={{ color: "var(--main-color)", fontWeight: "bold", fontSize: "1.1rem" }}>
            Tema de la aplicación
          </label>
          <div style={{ marginTop: 8, display: "flex", gap: 16 }}>
            <label style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <input
                type="radio"
                value="light"
                checked={theme === "light"}
                onChange={handleThemeChange}
              />
              Claro
            </label>
            <label style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <input
                type="radio"
                value="dark"
                checked={theme === "dark"}
                onChange={handleThemeChange}
              />
              Oscuro
            </label>
          </div>
        </div>

        <button
          onClick={handleSave}
          className="Register-button"
          style={{
            marginTop: 8,
            width: "100%",
            fontSize: "1.1rem",
          }}
        >
          Guardar cambios
        </button>
      </div>
    </div>
  );
}

export default Settings;