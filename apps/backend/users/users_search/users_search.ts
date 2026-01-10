import { Request, Response } from 'express';
import { pool } from './db';

export const usersSearch = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      `
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
      WHERE u.id = $1
      `,
      [id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({
      error: (error as Error).message
    });
  }
};
