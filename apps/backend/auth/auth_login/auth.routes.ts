import { Router } from 'express';
import { authLogin } from './auth_login';

const router = Router();

router.post('/auth/login', authLogin);

export default router;
