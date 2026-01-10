import { Router } from 'express';
import { usersUpdate } from './users_update';
import { usersUpdateSearch } from './users_update_search';

const router = Router();
router.get('/users/:id', usersUpdateSearch);
router.put('/users/:id', usersUpdate);

export default router;
