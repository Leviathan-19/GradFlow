import { Router } from 'express';
import { usersList } from './users_list';

const router = Router();

router.get('/users', usersList);

export default router;
