import { Router } from 'express';
import { login, getMe } from '../controllers/auth.controller.js';
import { requireAdmin } from '../middleware/auth.middleware.js';

const router = Router();

router.post('/login', login);
router.get('/me', requireAdmin, getMe);

export default router;
