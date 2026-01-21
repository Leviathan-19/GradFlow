import { Router } from "express";
import axios, { AxiosError } from "axios";

const router = Router();

// Service URLs
const SERVICES = {
  users_create: process.env.USERS_CREATE_URL || "http://localhost:3001",
  users_delete: process.env.USERS_DELETE_URL || "http://localhost:3002",
  users_list: process.env.USERS_LIST_URL || "http://localhost:3003",
  users_search: process.env.USERS_SEARCH_URL || "http://localhost:3004",
  users_update: process.env.USERS_UPDATE_URL || "http://localhost:3005",
  auth_login: process.env.AUTH_LOGIN_URL || "http://localhost:3006",
  auth_rol: process.env.AUTH_ROL_URL || "http://localhost:3007",
  auth_me: process.env.AUTH_ME_URL || "http://localhost:3008",
  files_init: process.env.FILE_SERVICE_INIT_URL || "http://localhost:3011",
  files_update: process.env.FILE_SERVICE_UPDATE_URL || "http://localhost:3012",
  files_upload: process.env.FILE_SERVICE_UPLOAD_URL || "http://localhost:3013",
  files_list: process.env.FILE_SERVICE_LIST_URL || "http://localhost:3014",
  files_download: process.env.FILE_SERVICE_DOWNLOAD_URL || "http://localhost:3015",
};

interface ServiceHealth {
  name: string;
  url: string;
  status: "healthy" | "unhealthy" | "unknown";
  responseTime?: number;
  error?: string;
  timestamp: string;
}

const checkServiceHealth = async (
  name: string,
  url: string
): Promise<ServiceHealth> => {
  const startTime = Date.now();
  const timestamp = new Date().toISOString();

  try {
    // Try to reach health endpoint or root
    const healthUrl = url.includes(":301") ? `${url}/health` : `${url}/api/health`;
    
    const response = await axios.get(healthUrl, {
      timeout: 5000,
      validateStatus: (status) => status < 500, // Accept 2xx, 3xx, 4xx
    });

    const responseTime = Date.now() - startTime;

    return {
      name,
      url,
      status: response.status < 400 ? "healthy" : "unhealthy",
      responseTime,
      timestamp,
    };
  } catch (error: any) {
    const axiosError = error as AxiosError;
    const responseTime = Date.now() - startTime;

    return {
      name,
      url,
      status: "unhealthy",
      responseTime,
      error: axiosError.message || "Connection failed",
      timestamp,
    };
  }
};

// Health check endpoint - checks all services
router.get("/", async (_req, res) => {
  try {
    const healthChecks = await Promise.all(
      Object.entries(SERVICES).map(([name, url]) =>
        checkServiceHealth(name, url)
      )
    );

    const healthyCount = healthChecks.filter((h) => h.status === "healthy").length;
    const totalCount = healthChecks.length;

    res.status(200).json({
      status: healthyCount === totalCount ? "healthy" : "degraded",
      gateway: "healthy",
      services: healthChecks,
      summary: {
        total: totalCount,
        healthy: healthyCount,
        unhealthy: totalCount - healthyCount,
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    res.status(500).json({
      status: "error",
      error: error.message,
      timestamp: new Date().toISOString(),
    });
  }
});

// Check specific service health
router.get("/:serviceName", async (req, res) => {
  const { serviceName } = req.params;
  const serviceUrl = SERVICES[serviceName as keyof typeof SERVICES];

  if (!serviceUrl) {
    return res.status(404).json({
      error: "Service not found",
      availableServices: Object.keys(SERVICES),
    });
  }

  const health = await checkServiceHealth(serviceName, serviceUrl);
  res.status(health.status === "healthy" ? 200 : 503).json(health);
});

export default router;
