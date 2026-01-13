import "./Admin.css";

export default function Admin() {
  return (
    <div className="admin-container">
      <div className="admin-card">
        <h1 className="admin-title">Admin Panel</h1>
        <p className="admin-subtitle">
          Only administrators can see this page.
        </p>

        <ul className="admin-list">
          <li>Manage users</li>
          <li>Assign roles</li>
          <li>System configuration</li>
        </ul>
      </div>
    </div>
  );
}

