import { saveVisitor } from '../services/storage.service.js';
import { sendWelcomeMail } from '../services/mail.service.js';

export async function createVisitor(req, res, next) {
  try {
    const { name, email, referrer } = req.body;
    if (!name || !email) {
      return res.status(400).json({ message: 'Name and email are required' });
    }

    const trimmedName = String(name).trim();
    const trimmedEmail = String(email).trim().toLowerCase();

    // 1. Save visitor in database / storage
    const visitor = await saveVisitor({
      name: trimmedName,
      email: trimmedEmail,
      referrer: referrer || '',
      at: new Date().toISOString(),
      welcomeEmailSent: true,
    });

    // 2. Dispatch the automated welcome / thank you email
    try {
      await Promise.race([
        sendWelcomeMail({ name: trimmedName, email: trimmedEmail }),
        new Promise((_, reject) => setTimeout(() => reject(new Error('Welcome mail timeout')), 3500)),
      ]);
    } catch (err) {
      console.warn('[Welcome Email Warning]:', err.message);
    }

    res.status(201).json({ ok: true, message: 'Visitor recorded successfully', visitor });
  } catch (err) {
    next(err);
  }
}
