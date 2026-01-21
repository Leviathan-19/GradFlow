import { Request, Response } from 'express';
import { pool } from './db';

export const getUsersByFilter = async (req: Request, res: Response) => {
  const { email, rol_id } = req.query; // Usamos query parameters

  // Validar que al menos un filtro esté presente
  if (!email && !rol_id) {
    return res.status(400).json({ 
      message: 'At least one search parameter is required: email or rol_id' 
    });
  }

  try {
    let query = `
      SELECT
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
        created_at,
        updated_at
      FROM usuarios
      WHERE 1=1
    `;

    const values: any[] = [];
    let index = 1;

    if (email) {
      query += ` AND email = $${index++}`;
      values.push(email);
    }

    if (rol_id) {
      query += ` AND rol_id = $${index++}`;
      values.push(rol_id);
    }

    // Ordenar por id y limitar resultados
    query += ` ORDER BY id LIMIT 100`;

    const result = await pool.query(query, values);

    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'No users found with the given criteria' });
    }

    // Devolver todos los resultados encontrados
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({
      error: (error as Error).message
    });
  }
};