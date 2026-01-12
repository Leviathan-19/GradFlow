import { useAuth } from "../api/useAuth";
import { logout } from "../api/auth";

export default function Menu() {
  const user = useAuth();

  return (
    <div>
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
  );
}
