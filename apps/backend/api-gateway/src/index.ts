import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import authRoutes from "./routes/auth.routes";
import usersRoutes from "./routes/users.routes";
import filesRoutes from "./routes/files.routes";
import healthRoutes from "./routes/health.routes";
import logsRoutes from "./routes/logs.routes";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// Request logging middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", usersRoutes);
app.use("/api/files", filesRoutes);
app.use("/api/health", healthRoutes);
app.use("/api/logs", logsRoutes);

// Root endpoint
app.get("/", (_req, res) => {
  res.json({
    message: "GradFlow API Gateway",
    version: "1.0.0",
    endpoints: {
      auth: "/api/auth",
      users: "/api/users",
      files: "/api/files",
      health: "/api/health",
      logs: "/api/logs",
    },
  });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`API Gateway running on port ${PORT}`);
  console.log(`Health check available at http://localhost:${PORT}/api/health`);
});

export default app;