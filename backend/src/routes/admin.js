const express = require('express')
const prisma = require('../lib/prisma')
const { adminOnly } = require('../middleware/auth')

const router = express.Router()

// GET /api/admin/dashboard
router.get('/dashboard', adminOnly, async (req, res) => {
  const now = new Date()
  const today = new Date(now); today.setHours(0,0,0,0)
  const todayEnd = new Date(now); todayEnd.setHours(23,59,59,999)
  const next7 = new Date(now); next7.setDate(next7.getDate() + 7)

  const [
    totalMembers,
    todayBookings,
    upcomingBookings,
    inventory,
    recentPayments,
    unpaidBalance,
    totalRevenue,
  ] = await Promise.all([
    prisma.member.count({ where: { role: 'MEMBER' } }),
    prisma.booking.findMany({
      where: { date: { gte: today, lte: todayEnd }, status: { not: 'CANCELLED' } },
      include: { member: { select: { name: true } }, field: true, guide: true },
      orderBy: { timeSlot: 'asc' },
    }),
    prisma.booking.findMany({
      where: { date: { gte: now, lte: next7 }, status: { not: 'CANCELLED' } },
      include: { member: { select: { name: true } }, field: true },
      orderBy: { date: 'asc' },
    }),
    prisma.birdInventory.findMany(),
    prisma.payment.findMany({
      include: { member: { select: { name: true } } },
      orderBy: { createdAt: 'desc' },
      take: 10,
    }),
    prisma.booking.aggregate({
      where: { status: { not: 'CANCELLED' } },
      _sum: { totalFee: true },
    }),
    prisma.payment.aggregate({
      where: { status: 'COMPLETED' },
      _sum: { amount: true },
    }),
  ])

  res.json({
    stats: {
      totalMembers,
      todayBookingCount: todayBookings.length,
      totalOwed: unpaidBalance._sum.totalFee || 0,
      totalRevenue: totalRevenue._sum.amount || 0,
    },
    todayBookings,
    upcomingBookings,
    inventory,
    recentPayments,
  })
})

// GET /api/admin/guides
router.get('/guides', adminOnly, async (req, res) => {
  const guides = await prisma.guide.findMany({ orderBy: { name: 'asc' } })
  res.json(guides)
})

// POST /api/admin/guides
router.post('/guides', adminOnly, async (req, res) => {
  const { name, phone } = req.body
  const guide = await prisma.guide.create({ data: { name, phone } })
  res.json(guide)
})

// GET /api/admin/fields
router.get('/fields', adminOnly, async (req, res) => {
  const fields = await prisma.field.findMany({ orderBy: { name: 'asc' } })
  res.json(fields)
})

// PATCH /api/admin/bookings/:id
router.patch('/bookings/:id', adminOnly, async (req, res) => {
  const { status, birdsHarvested, notes } = req.body
  const data = {}
  if (status) data.status = status
  if (birdsHarvested !== undefined) data.birdsHarvested = parseInt(birdsHarvested)
  if (notes !== undefined) data.notes = notes
  const booking = await prisma.booking.update({ where: { id: req.params.id }, data, include: { field: true, guide: true, member: { select: { name: true }} } })
  res.json(booking)
})

module.exports = router
