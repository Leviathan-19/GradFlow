import { Router } from 'express';
import { usersUpdate } from './users_update';

const router = Router();

router.put('/users/:id', usersUpdate);

export default router;
