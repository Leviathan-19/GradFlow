import { Router } from 'express';
import { getUsersByFilter } from './users_search';

const router = Router();

router.get('/users/search', getUsersByFilter);

export default router;
