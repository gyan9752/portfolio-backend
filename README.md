# Gyanvendra Mishra — Portfolio Backend API

Lightweight, production-ready Express & Node.js REST API supporting visitor tracking, contact inquiries, 1:1 slot bookings, and an authenticated admin dashboard (`/gadmin`).

## Features
- **Database Support**: Dual-mode data persistence via MongoDB Atlas (`mongoose`) with automatic local JSON fallback (`data/`).
- **Email Notifications**: Automated HTML transactional emails via Nodemailer (Welcome handshake, Contact inquiries receipt, 1:1 Booking confirmations).
- **Security**: Rate limiting with `express-rate-limit`, HTTP security headers via `helmet`, CORS policy, password hashing via `bcryptjs`, and stateless authentication with `jsonwebtoken` (JWT).
- **Admin Management**: Secure `/api/admin` endpoints for dashboard metrics, visitors logs, contact replies, and booking calendar appointments.

## Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Fill in your configuration details:
```env
PORT=5000
CORS_ORIGIN=http://localhost:5173
MONGODB_URI=mongodb+srv://<user>:<password>@cluster0.mongodb.net/portfolio
JWT_SECRET=your_jwt_secret_key

# Admin Defaults (Used by npm run seed)
ADMIN_EMAIL=gyanvendram@gmail.com
ADMIN_PASSWORD=your_secure_password

# SMTP Email Dispatch (e.g., Gmail App Password)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=gyanvendram@gmail.com
SMTP_PASS=your_gmail_app_password
MAIL_TO=gyanvendram@gmail.com
MAIL_FROM_NAME=Gyanvendra Mishra
```

### 3. Seed Default Admin (Optional)
```bash
npm run seed
```

### 4. Run the Server
- **Development**:
  ```bash
  npm run dev
  ```
- **Production**:
  ```bash
  npm start
  ```

## API Endpoints

### Public Endpoints
- `GET /api/health` — Service health check
- `POST /api/visitors/record` — Log visitor view/location
- `POST /api/contact` — Submit inquiry message & dispatch confirmation email
- `POST /api/bookings` — Book 1:1 calendar slot & dispatch confirmation email
- `GET /api/bookings/busy` — Retrieve booked slot timestamps

### Protected Admin Endpoints (`Authorization: Bearer <JWT>`)
- `POST /api/admin/login` — Authenticate and receive JWT token
- `GET /api/admin/me` — Verify current session
- `GET /api/admin/metrics` — Aggregate metrics & KPI statistics
- `GET /api/admin/visitors` — Paginated visitor activity logs
- `GET /api/admin/messages` — Paginated contact inquiries
- `POST /api/admin/messages/:id/reply` — Send direct email response to inquirer
- `GET /api/admin/bookings` — Paginated calendar bookings
- `PATCH /api/admin/bookings/:id` — Update booking status (`confirmed`, `canceled`, `rescheduled`)
