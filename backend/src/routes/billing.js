const express = require('express')
const prisma = require('../lib/prisma')
const { auth, adminOnly } = require('../middleware/auth')

const router = express.Router()

const CARD_FEE = 0.04

// GET /api/billing/my-payments
router.get('/my-payments', auth, async (req, res) => {
  const payments = await prisma.payment.findMany({
    where: { memberId: req.user.id },
    include: { booking: { include: { field: true } } },
    orderBy: { createdAt: 'desc' },
  })
  const totalOwed = await prisma.booking.aggregate({
    where: { memberId: req.user.id, status: { not: 'CANCELLED' } },
    _sum: { totalFee: true },
  })
  const totalPaid = await prisma.payment.aggregate({
    where: { memberId: req.user.id, status: 'COMPLETED' },
    _sum: { amount: true },
  })
  res.json({
    payments,
    totalOwed: totalOwed._sum.totalFee || 0,
    totalPaid: totalPaid._sum.amount || 0,
    balance: (totalOwed._sum.totalFee || 0) - (totalPaid._sum.amount || 0),
  })
})

// POST /api/billing/pay-cash (admin: mark payment received)
router.post('/pay-cash', adminOnly, async (req, res) => {
  const { memberId, bookingId, amount, method, notes } = req.body
  if (!memberId || !amount || !method) return res.status(400).json({ error: 'Missing required fields' })

  const payment = await prisma.payment.create({
    data: {
      memberId,
      bookingId: bookingId || null,
      amount: parseFloat(amount),
      processingFee: 0,
      netAmount: parseFloat(amount),
      method,
      status: 'COMPLETED',
      paidAt: new Date(),
      notes,
    },
  })
  res.json(payment)
})

// POST /api/billing/stripe-intent
router.post('/stripe-intent', auth, async (req, res) => {
  if (!process.env.STRIPE_SECRET_KEY) return res.status(503).json({ error: 'Stripe not configured' })
  const stripe = require('../lib/stripe')
  const { amount, bookingId } = req.body
  if (!amount) return res.status(400).json({ error: 'Amount required' })

  const amountWithFee = Math.round(amount * (1 + CARD_FEE) * 100) // cents
  const intent = await stripe.paymentIntents.create({
    amount: amountWithFee,
    currency: 'usd',
    metadata: { memberId: req.user.id, bookingId: bookingId || '' },
  })

  res.json({ clientSecret: intent.client_secret, fee: amount * CARD_FEE })
})

// GET /api/billing/all (admin)
router.get('/all', adminOnly, async (req, res) => {
  const payments = await prisma.payment.findMany({
    include: {
      member: { select: { id: true, name: true, email: true } },
      booking: { include: { field: true } },
    },
    orderBy: { createdAt: 'desc' },
  })
  res.json(payments)
})

module.exports = router
