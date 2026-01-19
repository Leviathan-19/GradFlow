import { useState } from "react";
import { createUser, updateUser } from "../api/users";

const ROLE_MAP: Record<string, string> = {
  admin: "682a9457-4e4b-49b6-9674-ebfcbf68938c",
  student: "d70f1978-c472-4cba-a70f-432337f19e9f",
  professor: "37bb1f3b-aee2-4e1e-995c-0c30a55d5017",
};

export default function UserFormModal({ user, onClose, onSaved }: any) {
  const [form, setForm] = useState({
    name: user?.name || "",
    lastname: user?.lastname || "",
    email: user?.email || "",
    password: "",
    degree: user?.degree || "",
    telephone_number: user?.telephone_number || "",
    role: user?.role || "student",
  });

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      if (!form.name || !form.lastname || !form.email || !form.degree) {
        alert("Missing required fields");
        return;
      }

      const payload = {
        name: form.name,
        lastname: form.lastname,
        email: form.email,
        degree: form.degree,
        telephone_number: form.telephone_number,
        rol_id: ROLE_MAP[form.role],
        ...(user ? {} : { password: form.password }),
      };

      if (user) {
        await updateUser(user.id, payload);
      } else {
        await createUser(payload);
      }

      onSaved();
      onClose();
    } catch (error) {
      console.error("USER FORM ERROR:", error);
      alert("User creation failed. Check console.");
    }
  };

  return (
    <div className="modal">
      <h3>{user ? "Edit User" : "Create User"}</h3>

      <input name="name" placeholder="Name" value={form.name} onChange={handleChange} />
      <input name="lastname" placeholder="Lastname" value={form.lastname} onChange={handleChange} />
      <input name="email" placeholder="Email" value={form.email} onChange={handleChange} />
      <input name="degree" placeholder="Degree" value={form.degree} onChange={handleChange} />
      <input name="telephone_number" placeholder="Phone" value={form.telephone_number} onChange={handleChange} />

      <select name="role" value={form.role} onChange={handleChange}>
        <option value="admin">Admin</option>
        <option value="student">Student</option>
        <option value="professor">Professor</option>
      </select>

      {!user && (
        <input name="password" type="password" placeholder="Password" value={form.password} onChange={handleChange} />
      )}

      <button onClick={handleSubmit}>Save</button>
      <button onClick={onClose}>Cancel</button>
    </div>
  );
}
