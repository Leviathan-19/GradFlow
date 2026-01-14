import { Request, Response } from 'express';
import { pool } from './db';
import bcrypt from 'bcrypt';

const SALT_ROUNDS = 10;

export const updateUserPassword = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { password } = req.body;

  if (!password) {
    return res.status(400).json({ message: 'Password is required' });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    const result = await pool.query(
      `
      UPDATE usuarios
      SET password = $1, updated_at = now()
      WHERE id = $2
      RETURNING id
      `,
      [hashedPassword, id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ message: 'Password updated successfully' });

  } catch (error) {
    res.status(500).json({
      error: (error as Error).message
    });
  }
};
