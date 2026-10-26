import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { env } from './config/env.js';
import authRoutes from './routes/auth.routes.js';
import contactRoutes from './routes/contact.routes.js';
import visitorRoutes from './routes/visitor.routes.js';
import bookingRoutes from './routes/booking.routes.js';
import adminRoutes from './routes/admin.routes.js';
import { errorHandler, notFound } from './middleware/errorHandler.js';

const app = express();

app.set('trust proxy', 1);
app.use(helmet());
app.use(cors({ origin: env.corsOrigins }));
app.use(express.json({ limit: '20kb' }));

// Health check
app.get('/api/health', (req, res) => res.json({ ok: true, timestamp: new Date().toISOString() }));

// Public endpoints
app.use('/api/auth', authRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/visitors', visitorRoutes);
app.use('/api/bookings', bookingRoutes);

// Protected Admin endpoints
app.use('/api/admin', adminRoutes);

// 404 & error handlers
app.use(notFound);
app.use(errorHandler);

export default app;
