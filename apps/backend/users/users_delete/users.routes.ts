import { Router } from 'express';
import { usersDelete } from './users_delete';

const router = Router();

router.delete('/users/:id', usersDelete);

export default router;

