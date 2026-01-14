import { useState } from "react";
import { createUser, updateUser } from "../api/users";

export default function UserFormModal({ user, onClose, onSaved }: any) {
  const [form, setForm] = useState({
    name: user?.name || "",
    lastname: user?.lastname || "",
    email: user?.email || "",
    password: "",
  });

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    if (user) {
      await updateUser(user.id, form);
    } else {
      await createUser(form);
    }
    onSaved();
    onClose();
  };

  return (
    <div className="modal">
      <h3>{user ? "Edit User" : "Create User"}</h3>

      <input name="name" placeholder="Name" value={form.name} onChange={handleChange} />
      <input name="lastname" placeholder="Lastname" value={form.lastname} onChange={handleChange} />
      <input name="email" placeholder="Email" value={form.email} onChange={handleChange} />
      {!user && (
        <input name="password" type="password" placeholder="Password" onChange={handleChange} />
      )}

      <button onClick={handleSubmit}>Save</button>
      <button onClick={onClose}>Cancel</button>
    </div>
  );
}
