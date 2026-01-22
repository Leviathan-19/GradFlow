import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../../api/auth";
import { useAuth } from "../../context/AuthContext";
import "./Login.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { refreshUser } = useAuth();

  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();

  const submit = async () => {
    console.log("🟡 SUBMIT CLICKED");

    try {
      setLoading(true);
      console.log("🟡 CALLING LOGIN API", { email, password });

      const response = await login(email, password);

      console.log("🟢 LOGIN RESPONSE", response);

    } catch (error: any) {
      console.error("🔴 LOGIN ERROR", error);
      alert(error.message || "Invalid credentials");
    } finally {
      setLoading(false);
      console.log("🟡 SUBMIT FINISHED");
    }
  };
  const submit = async () => {
    try {
      setLoading(true);
      const response = await login(email, password);
      localStorage.setItem("token", response.token);
<<<<<<< HEAD
      
      // Redirect based on role
      const userRole = response.user?.rol?.toLowerCase() || response.user?.rol_id;
      
      if (userRole === "admin" || userRole === "682a9457-4e4b-49b6-9674-ebfcbf68938c") {
        window.location.href = "/admin";
      } else {
        window.location.href = "/menu";
      }
=======

      await refreshUser(); // 🔥 ESTA LÍNEA ES LA CLAVE
>>>>>>> main
    } catch (error: any) {
      alert(error.response?.data?.message || error.message || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log("🟡 LOGIN EFFECT", { user, authLoading });

    if (!authLoading && user) {
      console.log("🟢 REDIRECTING", user.rol);

      if (user.rol === "admin") {
        navigate("/admin", { replace: true });
      } else {
        navigate("/menu", { replace: true });
      }
    }
  }, [user, authLoading, navigate]);
  useEffect(() => {
    console.log("🟡 AuthProvider mounted");
  }, []);


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
