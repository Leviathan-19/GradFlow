import { Request, Response } from 'express';
import { pool } from './db';
import bcrypt from 'bcrypt';

const SALT_ROUNDS = 10;

export const usersCreate = async (req: Request, res: Response) => {
  const {
    name,
    lastname,
    email,
    password,
    degree,
    telephone_number,
    rol_id
  } = req.body;

  try {
    // 1️⃣ Hash password
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    // 2️⃣ Insert hashed password
    const result = await pool.query(
      `INSERT INTO usuarios
       (name, lastname, email, password, degree, telephone_number, rol_id)
       VALUES ($1,$2,$3,$4,$5,$6,$7)
       RETURNING id, name, lastname, email, degree, telephone_number, rol_id`,
      [name, lastname, email, hashedPassword, degree, telephone_number, rol_id]
    );

    // 3️⃣ Never return password
    res.status(201).json(result.rows[0]);

  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};
