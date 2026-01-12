import { Router } from 'express';
import { usersCreate } from './users_create';
import { authMiddleware } from './middlewares/auth.middleware';
import { roleGuard } from './middlewares/role.guard';
const router = Router();

router.post('/users', usersCreate);

export default router;
