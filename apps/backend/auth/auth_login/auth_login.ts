import { Request, Response } from "express";
import { pool } from "./db";
import bcrypt from "bcrypt";
import jwt, { SignOptions } from "jsonwebtoken";

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
      u.id,
      u.name1,
      u.name2,
      u.lastname1,
      u.lastname2,
      u.email,
      u.password,
      r.name AS rol_name,
      r.id AS rol_id,
      u.status
      FROM usuarios u
      JOIN roles r ON u.rol_id = r.id
      WHERE u.email = $1
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

    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    const token = jwt.sign(
      {
        userId: user.id,
        rol: user.rol_name,
        rolId: user.rol_id,
        email: user.email,
      },
      process.env.JWT_SECRET as string,
      {
        expiresIn: process.env.JWT_EXPIRES_IN || "1h",
      } as jwt.SignOptions
    );

    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user.id,
        name1: user.name1,
        name2: user.name2,
        lastname1: user.lastname1,
        lastname2: user.lastname2,
        email: user.email,
        rol: user.rol_name,
        rol_id: user.rol_id,
      },
    });
  } catch (error) {
    res.status(500).json({
      error: (error as Error).message,
    });
  }
};
