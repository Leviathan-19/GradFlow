import { useAuth } from "../../api/useAuth";
import { logout } from "../../api/auth";
import "./Menu.css";
export default function Menu() {
  const user = useAuth();

  return (
    <div className="menu-container">
      <div className="menu-card">
        <h2>Main Menu</h2>

      {user ? (
        <>
          <p>Welcome {user.email}</p>

          {user.rol === "ADMIN" && (
            <a href="/admin">Manage Users</a>
          )}

          <br />
          <button onClick={logout}>Logout</button>
        </>
      ) : (
        <p>Loading...</p>
      )}
    </div>
    </div>
  );
}
