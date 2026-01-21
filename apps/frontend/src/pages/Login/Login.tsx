import { useState } from "react";
import { login } from "../../api/auth";
import "./Login.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    try {
      setLoading(true);
      const response = await login(email, password);
      localStorage.setItem("token", response.token);
      
      // Redirect based on role
      const userRole = response.user?.rol?.toLowerCase() || response.user?.rol_id;
      
      if (userRole === "admin" || userRole === "682a9457-4e4b-49b6-9674-ebfcbf68938c") {
        window.location.href = "/admin";
      } else {
        window.location.href = "/menu";
      }
    } catch (error: any) {
      alert(error.response?.data?.message || error.message || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2>Login</h2>

        <input
          type="email"
          placeholder="Email"
          onChange={e => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          onChange={e => setPassword(e.target.value)}
        />

        <button onClick={submit} disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>
      </div>
    </div>
  );
}
