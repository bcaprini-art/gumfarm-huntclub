# Gumfarm Hunt Club — Member Portal

Web app for Gumfarm Hunt Club (Genoa, IL). Members can book hunts, track bird packages, and pay fees online. Club admin gets a full management dashboard.

## Stack
- **Frontend:** React + Vite + Tailwind CSS
- **Backend:** Node.js + Express + Prisma ORM
- **Database:** PostgreSQL
- **Payments:** Stripe
- **Deploy:** Railway

## Local Dev

### Backend
```bash
cd backend
cp .env.example .env
# Fill in .env
npm install
npm run db:migrate
npm run db:seed
npm run dev
```

### Frontend
```bash
cd frontend
cp .env.example .env.local
# Fill in .env.local
npm install
npm run dev
```

## Admin Login
`admin@gumfarmhuntclub.com` / `Admin1234!`

## Railway Environment Variables

### Backend
| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | PostgreSQL connection string (Railway provides this) |
| `JWT_SECRET` | Random secret string |
| `PORT` | Set by Railway automatically |
| `CLIENT_URL` | Your frontend Railway URL |
| `STRIPE_SECRET_KEY` | From Stripe dashboard |
| `STRIPE_WEBHOOK_SECRET` | From Stripe webhook settings |

### Frontend
| Variable | Description |
|----------|-------------|
| `VITE_API_URL` | Your backend Railway URL |
| `VITE_STRIPE_PUBLIC_KEY` | Stripe publishable key |
