import {
  getStats,
  getVisitors,
  getMessages,
  getBookings,
  addMessageReply,
} from '../services/storage.service.js';
import { sendAdminReplyMail } from '../services/mail.service.js';

export async function getDashboardStats(req, res, next) {
  try {
    const stats = await getStats();
    res.json(stats);
  } catch (err) {
    next(err);
  }
}

export async function listVisitors(req, res, next) {
  try {
    const visitors = await getVisitors();
    res.json(visitors);
  } catch (err) {
    next(err);
  }
}

export async function listMessages(req, res, next) {
  try {
    const messages = await getMessages();
    res.json(messages);
  } catch (err) {
    next(err);
  }
}

export async function listBookings(req, res, next) {
  try {
    const bookings = await getBookings();
    res.json(bookings);
  } catch (err) {
    next(err);
  }
}

export async function replyToMessage(req, res, next) {
  try {
    const { messageId, toEmail, toName, subject, replyMessage } = req.body;
    if (!toEmail || !replyMessage) {
      return res.status(400).json({ message: 'Recipient email and reply message are required' });
    }

    // 1. Dispatch email reply
    await sendAdminReplyMail({
      toEmail,
      toName,
      subject: subject || 'Regarding your message to Gyanvendra Mishra',
      replyMessage,
    });

    // 2. Mark message as replied in storage if messageId is provided
    if (messageId) {
      await addMessageReply(messageId, {
        subject: subject || 'Reply',
        message: replyMessage,
      });
    }

    res.json({ ok: true, message: 'Reply sent successfully' });
  } catch (err) {
    next(err);
  }
}
