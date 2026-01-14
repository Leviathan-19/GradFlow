import { Request, Response } from 'express';
import { pool } from './db';

export const usersSearch = async (req: Request, res: Response) => {
  const { email, name, rol } = req.query;

  try {
    let query = `
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
      WHERE 1=1
    `;

    const values: any[] = [];
    let index = 1;

    if (email) {
      query += ` AND u.email = $${index++}`;
      values.push(email);
    }

    if (name) {
      query += ` AND u.name ILIKE $${index++}`;
      values.push(`%${name}%`);
    }

    if (rol) {
      query += ` AND r.name = $${index++}`;
      values.push(rol);
    }

    const result = await pool.query(query, values);

    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'No users found' });
    }

    res.json(result.rows);
  } catch (error) {
    res.status(500).json({
      error: (error as Error).message
    });
  }
};
