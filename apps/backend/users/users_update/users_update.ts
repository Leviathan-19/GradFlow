import { Request, Response } from 'express';
import { pool } from './db';
import bcrypt from 'bcrypt';

const SALT_ROUNDS = 10;

export const usersUpdate = async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ message: 'User id is required' });
  }

  const {
    name,
    lastname,
    email,
    password,
    degree,
    telephone_number,
    status,
    rol_id
  } = req.body;

  try {
    // 1️⃣ Hash password only if provided
    let hashedPassword: string | null = null;
    if (password) {
      hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
    }

    const result = await pool.query(
      `
      UPDATE usuarios
      SET
        name = COALESCE($1, name),
        lastname = COALESCE($2, lastname),
        email = COALESCE($3, email),
        password = COALESCE($4, password),
        degree = COALESCE($5, degree),
        telephone_number = COALESCE($6, telephone_number),
        status = COALESCE($7, status),
        rol_id = COALESCE($8, rol_id),
        updated_at = now()
      WHERE id = $9
      RETURNING
        id,
        name,
        lastname,
        email,
        degree,
        telephone_number,
        status,
        rol_id,
        updated_at
      `,
      [
        name,
        lastname,
        email,
        hashedPassword,
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
