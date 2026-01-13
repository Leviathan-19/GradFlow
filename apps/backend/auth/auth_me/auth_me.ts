import { Response } from "express";
import { pool } from "./db";
import { AuthRequest } from "./middlewares/auth.middleware";

export const authMe = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const result = await pool.query(
      `
      SELECT
        u.id,
        u.name,
        u.lastname,
        u.email,
        u.status,
        r.id AS rol_id,
        r.name AS rol_name
      FROM usuarios u
      JOIN roles r ON u.rol_id = r.id
      WHERE u.id = $1
      `,
      [userId]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    const user = result.rows[0];

    return res.status(200).json({
      id: user.id,
      name: user.name,
      lastname: user.lastname,
      email: user.email,
      rol: user.rol_name,
      rol_id: user.rol_id,
    });
  } catch (error) {
    return res.status(500).json({
      error: (error as Error).message,
    });
  }
};
