import { Router } from "express";
import axios from "axios";

const router = Router();

// CREATE USER
router.post("/", async (req, res) => {
  const response = await axios.post(
    "http://localhost:3001/api/users",
    req.body
  );
  res.json(response.data);
});

// DELETE USER
router.delete("/:id", async (req, res) => {
  const response = await axios.delete(
    `http://localhost:3002/api/users/${req.params.id}`
  );
  res.json(response.data);
});

// LIST USERS
router.get("/", async (_req, res) => {
  const response = await axios.get("http://localhost:3003/api/users");
  res.json(response.data);
});

router.get("/search", async (req, res) => {
  try {
    const response = await axios.get("http://localhost:3004/api/users/search", {
      params: req.query,
    });
    res.json(response.data);
  } catch (error: any) {
    console.error("SEARCH ERROR:", error.response?.status);
    res.status(500).json({ message: "Search failed" });
  }
});

// 👤 GET USER BY ID
router.get("/:id", async (req, res) => {
  const response = await axios.get(
    `http://localhost:3003/api/users/${req.params.id}`
  );
  res.json(response.data);
});

// UPDATE USER
router.put("/:id", async (req, res) => {
  const response = await axios.put(
    `http://localhost:3005/api/users/${req.params.id}`,
    req.body
  );
  res.json(response.data);
});
export default router;
