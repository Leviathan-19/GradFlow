import { Router } from 'express';
import { usersSearch } from './users_search';

const router = Router();

router.get('/users/:id', usersSearch);

export default router;
