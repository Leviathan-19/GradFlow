import { Router } from 'express';
import { usersCreate } from './users_create';

const router = Router();

router.post('/users', usersCreate);

export default router;
