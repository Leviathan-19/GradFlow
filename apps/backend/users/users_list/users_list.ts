import { Request, Response } from 'express';
import { pool } from './db';

export const usersList = async (_req: Request, res: Response) => {
  try {
    const result = await pool.query(`
      SELECT
        u.id,
        u.name,
        u.lastname,
        u.email,
        u.degree,
        u.telephone_number,
        u.status,
        u.created_at,
        r.name AS role
      FROM usuarios u
      JOIN roles r ON u.rol_id = r.id
      ORDER BY u.created_at DESC
    `);

    res.json(result.rows);
  } catch (error) {
    res.status(500).json({
      error: (error as Error).message
    });
  }
};
