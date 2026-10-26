import { Router } from 'express';
import {
  getDashboardStats,
  listVisitors,
  listMessages,
  listBookings,
  replyToMessage,
} from '../controllers/admin.controller.js';
import { requireAdmin } from '../middleware/auth.middleware.js';

const router = Router();

// All admin routes require valid JWT bearer token
router.use(requireAdmin);

router.get('/stats', getDashboardStats);
router.get('/visitors', listVisitors);
router.get('/messages', listMessages);
router.get('/bookings', listBookings);
router.post('/reply', replyToMessage);

export default router;
