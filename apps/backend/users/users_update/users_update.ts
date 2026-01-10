import { Request, Response } from 'express';
import { pool } from './db';

export const usersUpdate = async (req: Request, res: Response) => {
  const { id } = req.params;
  const {
    name,
    lastname,
    email,
    degree,
    telephone_number,
    status,
    rol_id
  } = req.body;

  try {
    const result = await pool.query(
      `
      UPDATE usuarios
      SET
        name = COALESCE($1, name),
        lastname = COALESCE($2, lastname),
        email = COALESCE($3, email),
        degree = COALESCE($4, degree),
        telephone_number = COALESCE($5, telephone_number),
        status = COALESCE($6, status),
        rol_id = COALESCE($7, rol_id),
        updated_at = now()
      WHERE id = $8
      RETURNING *
      `,
      [
        name,
        lastname,
        email,
        degree,
        telephone_number,
        status,
        rol_id,
        id
      ]
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
