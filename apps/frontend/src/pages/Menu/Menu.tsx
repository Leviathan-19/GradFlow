import { useAuth } from "../../api/useAuth";
import { logout } from "../../api/auth";
import "./Menu.css";
export default function Menu() {
  const user = useAuth();
  console.log("USER:", user);
  return (
    <div className="menu-container">
      <div className="menu-card">
        <h2>Main Menu</h2>

        {user ? (
          <>
            <p>Welcome {user.email}</p>

            {user && user.rol?.toUpperCase() === "ADMIN" && (
              <a href="/admin" className="menu-link">
                Manage Users
              </a>
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
