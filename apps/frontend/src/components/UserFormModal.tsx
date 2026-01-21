import { useState } from "react";
import { createUser, updateUser } from "../api/users";

const ROLE_MAP: Record<string, string> = {
  admin: "682a9457-4e4b-49b6-9674-ebfcbf68938c",
  student: "d70f1978-c472-4cba-a70f-432337f19e9f",
  professor: "37bb1f3b-aee2-4e1e-995c-0c30a55d5017",
};

export default function UserFormModal({ user, onClose, onSaved }: any) {
  const [form, setForm] = useState({
    name1: user?.name1 || "",
    name2: user?.name2 || "",
    lastname1: user?.lastname1 || "",
    lastname2: user?.lastname2 || "",
    email: user?.email || "",
    password: "",
    degree: user?.degree || "",
    telephone_number: user?.telephone_number || "",
    role: user?.rol_id ? 
      Object.keys(ROLE_MAP).find(key => ROLE_MAP[key] === user.rol_id) || "student"
      : "student",
  });

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      if (!form.name1 || !form.name2 || !form.lastname1 || !form.lastname2 || !form.email || !form.degree) {
        alert("Missing required fields");
        return;
      }

      const payload = {
        name1: form.name1,
        name2: form.name2,
        lastname1: form.lastname1,
        lastname2: form.lastname2,
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

      <input 
        name="name1" 
        placeholder="First Name" 
        value={form.name1} 
        onChange={handleChange} 
        required
      />
      <input 
        name="name2" 
        placeholder="Second Name" 
        value={form.name2} 
        onChange={handleChange} 
        required
      />
      <input 
        name="lastname1" 
        placeholder="First Lastname" 
        value={form.lastname1} 
        onChange={handleChange} 
        required
      />
      <input 
        name="lastname2" 
        placeholder="Second Lastname" 
        value={form.lastname2} 
        onChange={handleChange} 
        required
      />
      <input 
        name="email" 
        type="email"
        placeholder="Email" 
        value={form.email} 
        onChange={handleChange} 
        required
      />
      <input 
        name="degree" 
        placeholder="Degree" 
        value={form.degree} 
        onChange={handleChange} 
        required
      />
      <input 
        name="telephone_number" 
        placeholder="Phone Number" 
        value={form.telephone_number} 
        onChange={handleChange} 
      />

      <select name="role" value={form.role} onChange={handleChange}>
        <option value="admin">Admin</option>
        <option value="student">Student</option>
        <option value="professor">Professor</option>
      </select>

      {!user && (
        <input 
          name="password" 
          type="password" 
          placeholder="Password" 
          value={form.password} 
          onChange={handleChange} 
          required
        />
      )}

      <button onClick={handleSubmit}>Save</button>
      <button onClick={onClose}>Cancel</button>
    </div>
  );
}
