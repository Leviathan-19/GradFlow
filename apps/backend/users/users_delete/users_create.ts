import { Request, Response } from 'express';
import { pool } from './db';

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
    const result = await pool.query(
      `INSERT INTO usuarios
       (name, lastname, email, password, degree, telephone_number, rol_id)
       VALUES ($1,$2,$3,$4,$5,$6,$7)
       RETURNING *`,
      [name, lastname, email, password, degree, telephone_number, rol_id]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};
