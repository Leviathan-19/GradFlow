import { Request, Response } from "express";
import { pool } from "./db";
import bcrypt from "bcrypt";

export const authLogin = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      message: "Email and password are required",
    });
  }

  try {
    const result = await pool.query(
      `
      SELECT
        id,
        name,
        lastname,
        email,
        password,
        rol_id,
        status
      FROM usuarios
      WHERE email = $1
      `,
      [email]
    );

    if (result.rowCount === 0) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const user = result.rows[0];
    if (!user.status) {
      return res.status(403).json({ message: "User is inactive" });
    }
    console.log("EMAIL INPUT:", email);
    console.log("PASSWORD INPUT:", password);
    console.log("HASH FROM DB:", user.password);

    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    res.status(200).json({
      message: "Login successful",
      user: {
        id: user.id,
        name: user.name,
        lastname: user.lastname,
        email: user.email,
        rol_id: user.rol_id,
      },
    });
  } catch (error) {
    res.status(500).json({
      error: (error as Error).message,
    });
  }
};
