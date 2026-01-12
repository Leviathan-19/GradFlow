// src/pages/Login.tsx
import { useState } from "react";
import { login } from "../api/auth";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const submit = async () => {
  try {
    const response = await login(email, password);
    console.log("LOGIN RESPONSE:", response);

    localStorage.setItem("token", response.token);
    window.location.href = "/menu";
  } catch (error: any) {
    console.error("LOGIN ERROR:", error);

    if (error.response) {
      console.error("STATUS:", error.response.status);
      console.error("DATA:", error.response.data);
    }

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
