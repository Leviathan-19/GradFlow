import { Request, Response } from 'express';
import { pool } from './db';

export const usersUpdate = async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ message: 'User id is required' });
  }

  const {
    name1,
    name2,
    lastname1,
    lastname2,
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
        name1 = COALESCE($1, name1),
        name2 = COALESCE($2, name2),
        lastname1 = COALESCE($3, lastname1),
        lastname2 = COALESCE($4, lastname2),
        email = COALESCE($5, email),
        degree = COALESCE($6, degree),
        telephone_number = COALESCE($7, telephone_number),
        status = COALESCE($8, status),
        rol_id = COALESCE($9, rol_id),
        updated_at = now()
      WHERE id = $10
      RETURNING
        id,
        name1,
        name2,
        lastname1,
        lastname2,
        email,
        degree,
        telephone_number,
        status,
        rol_id,
        updated_at
      `,
      [
        name1,
        name2,
        lastname1,
        lastname2,
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

    res.json({
      message: 'User updated successfully',
      user: result.rows[0]
    });

  } catch (error) {
    res.status(500).json({
      error: (error as Error).message
    });
  }
};
