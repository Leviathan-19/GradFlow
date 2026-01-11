// src/pages/Login.tsx
import { useState } from "react";
import { login } from "../api/auth";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const submit = async () => {
    try {
      const { token } = await login(email, password);
      localStorage.setItem("token", token);
      window.location.href = "/menu";
    } catch {
      alert("Credenciales inválidas");
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <input placeholder="email" onChange={e => setEmail(e.target.value)} />
      <input type="password" onChange={e => setPassword(e.target.value)} />
      <button onClick={submit}>Entrar</button>
    </div>
  );
}
