import 'dotenv/config';

export const env = {
  port: Number(process.env.PORT) || 5000,
  corsOrigins: (process.env.CORS_ORIGIN || 'http://localhost:5173')
    .split(',')
    .map((o) => o.trim())
    .filter(Boolean),
  mongodbUri: process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/portfolio',
  jwtSecret: process.env.JWT_SECRET || 'gm_portfolio_jwt_secret_key_2026_super_secure',
  admin: {
    email: process.env.ADMIN_EMAIL || 'gyanvendram@gmail.com',
    password: process.env.ADMIN_PASSWORD || 'admin123',
  },
  smtp: {
    host: process.env.SMTP_HOST || '',
    port: Number(process.env.SMTP_PORT) || 587,
    user: process.env.SMTP_USER || '',
    pass: process.env.SMTP_PASS || '',
    to: process.env.MAIL_TO || 'gyanvendram@gmail.com',
    fromName: process.env.MAIL_FROM_NAME || 'Gyanvendra Mishra',
  },
};
