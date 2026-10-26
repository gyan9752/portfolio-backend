import { saveMessage } from '../services/storage.service.js';
import { sendContactMail } from '../services/mail.service.js';

export async function createContact(req, res, next) {
  try {
    await saveMessage(req.contact);
    // Email is best-effort: a mail failure must not lose the message we already stored.
    sendContactMail(req.contact).catch((err) => console.error('Mail failed:', err.message));
    res.status(201).json({ ok: true, message: 'Message received' });
  } catch (err) {
    next(err);
  }
}
