import { Request, Response } from 'express';
import { pool } from './db';
import axios from 'axios';

const FILE_SERVICE_UPDATE_URL = process.env.FILE_SERVICE_UPDATE_URL || 'http://localhost:3012';
const STUDENT_ROLE_ID = 'd70f1978-c472-4cba-a70f-432337f19e9f';

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
    // First, get the old user data to compare names
    const oldUserResult = await pool.query(
      `SELECT name1, name2, lastname1, lastname2, rol_id FROM usuarios WHERE id = $1`,
      [id]
    );

    if (oldUserResult.rowCount === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    const oldUser = oldUserResult.rows[0];

    // Update user
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

    const updatedUser = result.rows[0];
    const finalRolId = rol_id || oldUser.rol_id;

    // Check if names changed and user is a student
    const namesChanged = 
      (name1 && name1 !== oldUser.name1) ||
      (name2 && name2 !== oldUser.name2) ||
      (lastname1 && lastname1 !== oldUser.lastname1) ||
      (lastname2 && lastname2 !== oldUser.lastname2);

    if (namesChanged && finalRolId === STUDENT_ROLE_ID) {
      try {
        // Get final values (use new if provided, otherwise old)
        const finalName1 = name1 || oldUser.name1;
        const finalName2 = name2 || oldUser.name2;
        const finalLastname1 = lastname1 || oldUser.lastname1;
        const finalLastname2 = lastname2 || oldUser.lastname2;

        await axios.put(`${FILE_SERVICE_UPDATE_URL}/files/update-student-folder`, {
          old_lastname1: oldUser.lastname1,
          old_lastname2: oldUser.lastname2,
          old_name1: oldUser.name1,
          old_name2: oldUser.name2,
          new_lastname1: finalLastname1,
          new_lastname2: finalLastname2,
          new_name1: finalName1,
          new_name2: finalName2,
          rol_id: finalRolId,
          user_id: id
        });
        console.log(`✅ Folder structure updated for student ${id}`);
      } catch (fileError: any) {
        // Log error but don't fail the user update
        console.error('⚠️ Error updating folder structure:', fileError.response?.data || fileError.message);
        // You might want to add retry logic or queue this for later processing
      }
    }

    res.json({
      message: 'User updated successfully',
      user: updatedUser
    });

  } catch (error) {
    res.status(500).json({
      error: (error as Error).message
    });
  }
};
