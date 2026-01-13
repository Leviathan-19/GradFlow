import { Router } from 'express';
import { authMe } from './auth_me';
import { authMiddleware } from "./middlewares/auth.middleware";

const router = Router();

router.post('/auth/me', authMe);
router.get("/auth/me", authMiddleware, authMe);

export default router;
