import { Router } from "express";
import { getServiceLogs, clearLogs } from "../middlewares/logging.middleware";

const router = Router();

// Get service logs
router.get("/", (req, res) => {
  const service = req.query.service as string | undefined;
  const limit = parseInt(req.query.limit as string) || 100;

  const logs = getServiceLogs(service, limit);

  res.json({
    service: service || "all",
    count: logs.length,
    logs,
  });
});

// Get logs for specific service
router.get("/:service", (req, res) => {
  const { service } = req.params;
  const limit = parseInt(req.query.limit as string) || 100;

  const logs = getServiceLogs(service, limit);

  res.json({
    service,
    count: logs.length,
    logs,
  });
});

// Clear logs (admin only - consider adding auth middleware)
router.delete("/", (_req, res) => {
  clearLogs();
  res.json({ message: "Logs cleared" });
});

export default router;
