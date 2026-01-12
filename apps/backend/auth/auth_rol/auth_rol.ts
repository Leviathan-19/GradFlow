import { Request, Response } from 'express';
import { pool } from './db';

export const getRoles = async (_req: Request, res: Response) => {
  try {
    const result = await pool.query(
      `
      SELECT
        id,
        name
      FROM roles
      ORDER BY name
      `
    );
    res.status(200).json(result.rows);

  } catch (error) {
    res.status(500).json({
      error: (error as Error).message
    });
  }
};
