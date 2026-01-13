import { useAuth } from "../../api/useAuth";
import { logout } from "../../api/auth";
import "./Menu.css";
export default function Menu() {
  const user = useAuth();

  return (
    <div className="menu-container">
      <div className="menu-card">
        <h2>Menú principal</h2>

      {user ? (
        <>
          <p>Bienvenido {user.email}</p>

          {user.rol === "ADMIN" && (
            <a href="/admin">Gestionar Usuarios</a>
          )}

          <br />
          <button onClick={logout}>Salir</button>
        </>
      ) : (
        <p>Cargando...</p>
      )}
    </div>
    </div>
  );
}
