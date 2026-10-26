const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Validates + sanitises the contact payload and attaches it to req.contact. */
export function validateContact(req, res, next) {
  const { name = '', email = '', message = '' } = req.body || {};
  const clean = {
    name: String(name).trim().slice(0, 100),
    email: String(email).trim().slice(0, 150),
    message: String(message).trim().slice(0, 3000),
  };

  if (clean.name.length < 1) return res.status(400).json({ message: 'Please enter your name.' });
  if (!EMAIL.test(clean.email)) return res.status(400).json({ message: 'Please enter a valid email.' });
  if (clean.message.length < 2) return res.status(400).json({ message: 'Message is too short.' });

  req.contact = clean;
  return next();
}
