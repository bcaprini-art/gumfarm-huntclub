require('dotenv').config()
require('express-async-errors')

const express = require('express')
const cors = require('cors')

const authRoutes = require('./routes/auth')
const bookingsRoutes = require('./routes/bookings')
const membersRoutes = require('./routes/members')
const birdsRoutes = require('./routes/birds')
const billingRoutes = require('./routes/billing')
const adminRoutes = require('./routes/admin')

const app = express()

app.use(cors({ origin: process.env.CLIENT_URL || true, credentials: true }))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Health check
app.get('/health', (req, res) => res.json({ status: 'ok', service: 'Gumfarm Hunt Club API' }))

// Routes
app.use('/api/auth', authRoutes)
app.use('/api/bookings', bookingsRoutes)
app.use('/api/members', membersRoutes)
app.use('/api/birds', birdsRoutes)
app.use('/api/billing', billingRoutes)
app.use('/api/admin', adminRoutes)


// 404
app.use((req, res) => {
  res.status(404).json({ error: `Route ${req.method} ${req.path} not found` })
})

// Error handler
app.use((err, req, res, next) => {
  console.error('[error]', err)
  res.status(500).json({ error: err.message || 'Internal server error' })
})

const PORT = process.env.PORT || 4003
app.listen(PORT, () => {
  console.log(`🦅 Gumfarm Hunt Club API running on http://localhost:${PORT}`)
})
