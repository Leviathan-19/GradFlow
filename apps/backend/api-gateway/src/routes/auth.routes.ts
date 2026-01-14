import { Router } from "express";
import axios from "axios";
import { authMiddleware } from "../middlewares/auth.middleware";
const router = Router();
router.get("/auth/me", authMiddleware);
router.post("/login", async (req, res) => {
  const response = await axios.post(
    "http://localhost:3006/api/auth/login",
    req.body
  );
  res.json(response.data);
});

router.get("/roles", async (_, res) => {
  const response = await axios.get(
    "http://localhost:3007/api/roles"
  );
  res.json(response.data);
});

router.get("/me", async (req, res) => {
  const response = await axios.get(
    "http://localhost:3008/api/auth/me",
    {
      headers: {
        Authorization: req.headers.authorization
      }
    }
  );
  res.json(response.data);
});


export default router;
