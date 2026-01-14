import { useAuth } from "../../api/useAuth";
import { logout } from "../../api/auth";
import "./Menu.css";

export default function Menu() {
  const { user, loading } = useAuth();

  if (loading) {
    return <p className="menu-loading">Loading...</p>;
  }

  return (
    <div className="menu-container">
      <div className="menu-card">
        <h2>Main Menu</h2>

        {user ? (
          <>
            <p>Welcome {user.email}</p>

            {user.rol?.toUpperCase() === "ADMIN" && (
              <a href="/admin" className="menu-link">
                Manage Users
              </a>
            )}

            <button className="menu-logout" onClick={logout}>
              Logout
            </button>
          </>
        ) : (
          <p>Not authenticated</p>
        )}
      </div>
    </div>
  );
}
