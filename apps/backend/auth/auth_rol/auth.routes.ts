import { Router } from 'express';
import { getRoles } from './auth_rol';

const router = Router();
router.get('/roles', (req, res, next) => {
  next();
}, getRoles);

export default router;
