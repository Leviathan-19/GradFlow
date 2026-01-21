import { Request, Response } from 'express';
import { pool } from './db';
import bcrypt from 'bcrypt';
import axios from 'axios';

const SALT_ROUNDS = 10;
// Use API Gateway instead of direct file-service call
const API_GATEWAY_URL = process.env.API_GATEWAY_URL || 'http://localhost:3000';
const STUDENT_ROLE_ID = 'd70f1978-c472-4cba-a70f-432337f19e9f';

export const usersCreate = async (req: Request, res: Response) => {
  const {
    name1,
    name2,
    lastname1,
    lastname2,
    email,
    password,
    degree,
    telephone_number,
    rol_id
  } = req.body;

  try {
    // Validate required fields
    if (!name1 || !name2 || !lastname1 || !lastname2) {
      return res.status(400).json({ 
        error: 'name1, name2, lastname1, and lastname2 are required' 
      });
    }

    // 1️⃣ Hash password
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    // 2️⃣ Insert hashed password
    const result = await pool.query(
      `INSERT INTO usuarios
       (name1, name2, lastname1, lastname2, email, password, degree, telephone_number, rol_id)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
       RETURNING id, name1,name2, lastname1,lastname2, email, degree, telephone_number, rol_id`,
      [name1,name2, lastname1, lastname2, email, hashedPassword, degree, telephone_number, rol_id]
    );

    const newUser = result.rows[0];

    // 3️⃣ Call file-service via API Gateway to create folder structure if user is a student
    if (rol_id === STUDENT_ROLE_ID) {
      try {
        await axios.post(`${API_GATEWAY_URL}/api/files/init-student`, {
          lastname1: lastname1,
          lastname2: lastname2,
          name1: name1,
          name2: name2,
          rol_id: rol_id,
          user_id: newUser.id
        });
        console.log(`[SUCCESS] Folder structure created for student ${newUser.id}`);
      } catch (fileError: any) {
        // Log error but don't fail the user creation
        console.error('[ERROR] Failed to create folder structure:', {
          userId: newUser.id,
          error: fileError.response?.data || fileError.message,
          status: fileError.response?.status,
        });
        // You might want to add retry logic or queue this for later processing
      }
    }

    res.status(201).json(newUser);

  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};
