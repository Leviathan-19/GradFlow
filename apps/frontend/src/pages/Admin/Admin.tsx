import { useEffect, useState } from "react";
import { listUsers, searchUsers, deleteUser } from "../../api/users";
import UserTable from "../../components/UserTable";
import ConfirmDeleteModal from "../../components/ConfirmDeleteModal";
import UserFormModal from "../../components/UserFormModal";
import "./Admin.css";

export default function Admin() {
  const [users, setUsers] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [selectedUser, setSelectedUser] = useState<any | null>(null);

  const [showForm, setShowForm] = useState(false);
  const [showDelete, setShowDelete] = useState(false);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    const data = await listUsers();
    setUsers(data);
  };

  const handleSearch = async () => {
    if (!search) return loadUsers();
    const data = await searchUsers({ q: search });
    setUsers(data);
  };

  const editUser = (user: any) => {
    setSelectedUser(user);
    setShowForm(true);
  };

  const confirmDelete = (user: any) => {
    setSelectedUser(user);
    setShowDelete(true);
  };

  const handleDelete = async () => {
    if (!selectedUser) return;
    await deleteUser(selectedUser.id);
    setShowDelete(false);
    loadUsers();
  };

  return (
    <div className="admin-container">
      <h2>User Management</h2>

      <div>
        <input
          placeholder="Search by name, email, role..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button onClick={handleSearch}>Search</button>
        <button onClick={() => {
          setSelectedUser(null);
          setShowForm(true);
        }}>
          + Create User
        </button>
      </div>

      <UserTable
        users={users}
        onEdit={editUser}
        onDelete={confirmDelete}
      />

      {showDelete && selectedUser && (
        <ConfirmDeleteModal
          user={selectedUser}
          onConfirm={handleDelete}
          onCancel={() => setShowDelete(false)}
        />
      )}

      {showForm && (
        <UserFormModal
          user={selectedUser}
          onClose={() => setShowForm(false)}
          onSaved={loadUsers}
        />
      )}
    </div>
  );
}
