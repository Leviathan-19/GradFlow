import { Router } from 'express';
import { usersUpdate } from './users_update';
import { updateUserPassword } from './users_update_password';
import { getUserById } from './users_update_search';

const router = Router();

router.get('/users/:id', getUserById);
router.put('/users/:id', usersUpdate);
router.put('/users/:id/password', updateUserPassword);

export default router;
