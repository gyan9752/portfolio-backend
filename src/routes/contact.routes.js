import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { createContact } from '../controllers/contact.controller.js';
import { validateContact } from '../middleware/validateContact.js';

const router = Router();

// 60 messages / 15 min per IP prevents bot floods while allowing smooth testing
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 60,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Too many messages, please try again later.' },
});

router.post('/', limiter, validateContact, createContact);

export default router;
