import React, { useEffect, useState } from "react";
import { Navigate, replace , useNavigate} from "react-router-dom";
import Swal from "sweetalert2";
import API_URL from "../Api";
function Profile() {
  const [user, setUser] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [photo, setPhoto] = useState(null);
  const [preview, setPreview] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
  const auth = localStorage.getItem("auth");
  if (!auth) {
    navigate("/auth/login", { replace: true });
  }
}, [navigate]);


  useEffect(() => {
    const usernameLS = localStorage.getItem("username");
    fetch(`${API_URL}/auth/profile?username=${usernameLS}`)
      .then(res => res.json())
      .then(data => {
        setUser(data);
        setName(data.name);
        setUsername(data.username);
        setPreview(data.photo);
      })
      .catch(() => setUser(null));
  }, []);
  if (!user) {
        navigate("/auth/login", { replace: true });
    }

  const handleEdit = async () => {
    const { value: passwordInput } = await Swal.fire({
      title: "Confirma tu contraseña",
      input: "password",
      inputLabel: "Introduce tu contraseña actual para editar tu perfil",
      inputAttributes: {
        autocapitalize: "off",
        autocorrect: "off",
        autocomplete: "current-password",
      },
      showCancelButton: true,
      confirmButtonText: "Confirmar",
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
    if (data.success) {
      setEditMode(true);
    } else {
      Swal.fire("Error", "Contraseña incorrecta", "error");
    }
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    setPhoto(file);
    if (file) setPreview(URL.createObjectURL(file));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", name);
    formData.append("username", username);
    if (photo) formData.append("photo", photo);
    if (password) formData.append("password", password);

    const usernameLS = localStorage.getItem("username");
    const res = await fetch(`${API_URL}/auth/profile/update?username=${usernameLS}`, {
      method: "PUT",
      body: formData,
    });
    const data = await res.json();
    if (data.error) {
      Swal.fire("Error", data.error, "error");
    } else {
      Swal.fire("¡Guardado!", "Perfil actualizado", "success");
      setUser(data);
      setEditMode(false);
      setPassword("");
      setPhoto(null);
      // Si cambió el username, actualiza localStorage
      localStorage.setItem("username", data.username);
    }
  };

  const handleDelete = async () => {
  const { value: passwordInput } = await Swal.fire({
    title: "Confirma tu contraseña",
    input: "password",
    inputLabel: "Ingresa tu contraseña para eliminar tu cuenta",
    inputAttributes: {
      autocapitalize: "off",
      autocorrect: "off",
      autocomplete: "current-password",
    },
    showCancelButton: true,
    confirmButtonText: "Confirmar",
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

  const usernameLS = localStorage.getItem("username");

  // Verifica contraseña
  const res = await fetch(`${API_URL}/auth/profile/verify-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username: usernameLS, password: passwordInput })
  });
  const data = await res.json();
  if (!data.success) {
    Swal.fire("Error", "Contraseña incorrecta", "error");
    return; 
  }

  const confirm = await Swal.fire({
    title: "¿Eliminar cuenta?",
    text: "Esta acción no se puede deshacer.",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Sí, eliminar",
    cancelButtonText: "Cancelar",

    customClass:{
      confirmButton: "confirmar-button",
      cancelButton: "cancelar-button"
    }
  });

  if (confirm.isConfirmed) {
    const res = await fetch(`${API_URL}/auth/profile/delete?username=${usernameLS}`, {
      method: "DELETE",
    });
    const data = await res.json();

    if (data.error) {
      Swal.fire("Error", data.error, "error");
    } else {
      Swal.fire("Cuenta eliminada", "Tu cuenta ha sido eliminada.", "success");
      localStorage.clear();
      navigate("/auth/login", { replace: true });
    }
  }
};


  if (!user) return (
   <>
  <div style={{ marginTop: "40px", fontSize: "2rem", color: "#8a2036" , textAlign: "center", fontWeight: "bold"}}>
    Cargando perfil...
  </div>;
  <br />
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
  </>
  )

  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      marginTop: "40px"
    }}>
      {editMode ? (
        <form onSubmit={handleSave} style={{ width: "100%" }}>
          {/* Imagen de previsualización */}
          <div style={{ width: "100%", textAlign: "center" }}>
            <img
              src={preview || user.photo}
              alt="Foto de perfil"
              style={{
                width: "180px",
                height: "180px",
                borderRadius: "50%",
                objectFit: "cover",
                border: "6px solid #8a2036",
                boxShadow: "0 4px 24px rgba(138,32,54,0.15)",
                background: "#fff",
                marginBottom: "24px"
              }}
            />
            <label
              htmlFor="file-upload"
              style={{
                display: "inline-block",
                background: "#8a2036",
                color: "#fff",
                borderRadius: "20px",
                padding: "10px 24px",
                cursor: "pointer",
                marginTop: "8px",
                fontWeight: "bold",
                fontFamily: "robotomedium, sans-serif",
                transition: "background 0.2s"
              }}
            >
              Cambiar imagen
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
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="Nombre completo"
            style={{
              padding: "10px",
              borderRadius: "20px",
              border: "1px solid #8a2036",
              fontSize: "1rem",
              width: "70%",
              marginBottom: "8px"
            }}
          />
          <br />
          <br />
          <input
            type="text"
            value={username}
            onChange={e => setUsername(e.target.value)}
            placeholder="Usuario"
            style={{
              padding: "10px",
              borderRadius: "20px",
              border: "1px solid #8a2036",
              fontSize: "1rem",
              width: "70%",
              marginBottom: "8px"
            }}
          />
          <br />
          <br />
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="Nueva contraseña (opcional)"
            style={{
              padding: "10px",
              borderRadius: "20px",
              border: "1px solid #8a2036",
              fontSize: "1rem",
              width: "70%",
              marginBottom: "8px"
            }}
          />
          <br /><br />
          <button type="submit" className="Register-button" style={{ marginBottom: 8 }}>
            Guardar cambios
          </button>
          <button type="button" onClick={() => setEditMode(false)} style={{
            background: "#fff",
            color: "#8a2036",
            border: "1px solid #8a2036",
            borderRadius: "20px",
            padding: "10px 24px",
            fontWeight: "bold",
            cursor: "pointer"
          }}>
            Cancelar
          </button>
        </form>
      ) : (
        <>
          <img
            src={user.photo}
            alt="Foto de perfil"
            style={{
              width: "180px",
              height: "180px",
              borderRadius: "50%",
              objectFit: "cover",
              border: "6px solid #8a2036",
              boxShadow: "0 4px 24px rgba(138,32,54,0.15)",
              background: "#fff",
              marginBottom: "24px"
            }}
          />
          <h2 style={{ color: "#8a2036", margin: "0 0 8px 0", fontFamily: "robotomedium" }}>
            {user.name}
          </h2>
          <div style={{
            color: "#444",
            fontSize: "1.2rem",
            background: "#f7eaea",
            padding: "8px 24px",
            borderRadius: "16px",
            fontFamily: "robotomedium"
          }}>
            @{user.username}
          </div>
          <button onClick={handleEdit} className="Register-button" style={{ marginTop: 24 }}>
            Editar perfil
          </button>
          <button onClick={handleDelete} style={{
            background: "#fff",
            color: "#8a2036",
            border: "1px solid #8a2036",
            borderRadius: "20px",
            padding: "10px 24px",
            fontWeight: "bold",
            marginTop: "12px",
            cursor: "pointer"
          }}>
            Eliminar cuenta
          </button>
        </>
      )}
    </div>
  );
}

export default Profile;