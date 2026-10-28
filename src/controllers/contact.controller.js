import { saveMessage } from '../services/storage.service.js';
import { sendContactMail } from '../services/mail.service.js';

export async function createContact(req, res, next) {
  try {
    const saved = await saveMessage(req.contact);

    // In serverless (Vercel), background promises are frozen after response is sent.
    // We await mail delivery with a 3.5s timeout so it sends before freeze, but never blocks user.
    try {
      await Promise.race([
        sendContactMail(req.contact),
        new Promise((_, reject) => setTimeout(() => reject(new Error('Mail timeout')), 3500)),
      ]);
    } catch (mailErr) {
      console.warn('[Mail Warning]:', mailErr.message);
    }

    res.status(201).json({ ok: true, message: 'Message received', id: saved.id });
  } catch (err) {
    next(err);
  }
}
