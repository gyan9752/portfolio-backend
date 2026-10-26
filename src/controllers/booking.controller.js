import { saveBooking } from '../services/storage.service.js';
import { sendBookingConfirmationMail } from '../services/mail.service.js';

export async function createBooking(req, res, next) {
  try {
    const { name, email, date, time, notes } = req.body;
    if (!name || !email || !date || !time) {
      return res.status(400).json({ message: 'Name, email, date and time are required' });
    }

    const booking = await saveBooking({
      name: String(name).trim(),
      email: String(email).trim().toLowerCase(),
      date,
      time,
      notes: notes || '',
    });

    sendBookingConfirmationMail({ name, email, date, time, notes }).catch((err) => {
      console.error('[Booking Mail Error]:', err.message);
    });

    res.status(201).json({ ok: true, message: 'Meeting scheduled successfully', booking });
  } catch (err) {
    next(err);
  }
}
