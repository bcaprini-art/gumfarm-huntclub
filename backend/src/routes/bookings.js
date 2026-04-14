const express = require('express')
const prisma = require('../lib/prisma')
const { auth } = require('../middleware/auth')

const router = express.Router()

// Pricing config
const PRICES = {
  PHEASANT: { member: 22, nonMember: 29, afterDec31Extra: 2 },
  CHUKAR: { member: 16, nonMember: 21, afterDec31Extra: 2 },
  QUAIL: { member: 10, nonMember: 12, afterDec31Extra: 1 },
}
const GUIDE_FEE = 100
const BIRD_CLEANING_FEE = 5
const CARD_PROCESSING_FEE = 0.04

function calcBirdPrice(species, count, isMember, huntDate) {
  const p = PRICES[species]
  if (!p || count === 0) return 0
  const afterDec31 = huntDate && new Date(huntDate).getMonth() === 11 ? false : new Date(huntDate) > new Date(`${new Date(huntDate).getFullYear()}-12-31`)
  const base = isMember ? p.member : p.nonMember
  const extra = afterDec31 ? p.afterDec31Extra : 0
  return (base + extra) * count
}

// GET /api/bookings
router.get('/', auth, async (req, res) => {
  const where = req.user.role === 'ADMIN' ? {} : { memberId: req.user.id }
  const bookings = await prisma.booking.findMany({
    where,
    include: { field: true, guide: true, member: { select: { id: true, name: true, email: true } } },
    orderBy: { date: 'asc' },
  })
  res.json(bookings)
})

// GET /api/bookings/availability?date=YYYY-MM-DD&fieldId=xxx
router.get('/availability', auth, async (req, res) => {
  const { date, fieldId } = req.query
  if (!date) return res.status(400).json({ error: 'date required' })

  const start = new Date(date)
  start.setHours(0, 0, 0, 0)
  const end = new Date(date)
  end.setHours(23, 59, 59, 999)

  const where = {
    date: { gte: start, lte: end },
    status: { not: 'CANCELLED' },
  }
  if (fieldId) where.fieldId = fieldId

  const bookings = await prisma.booking.findMany({
    where,
    include: { field: true },
  })

  const fields = await prisma.field.findMany({ where: { active: true } })
  const availability = fields.map(f => {
    const dayBookings = bookings.filter(b => b.fieldId === f.id)
    const bookedHunters = dayBookings.reduce((s, b) => s + b.partySize, 0)
    return {
      field: f,
      bookedHunters,
      availableSlots: Math.max(0, f.maxHunters - bookedHunters),
      bookings: dayBookings,
    }
  })

  res.json(availability)
})

// POST /api/bookings
router.post('/', auth, async (req, res) => {
  const { fieldId, date, timeSlot, partySize, guideRequested, guideId,
    pheasantsReleased, chukarsReleased, quailReleased,
    birdCleaning, trapHouse, notes } = req.body

  if (!fieldId || !date || !timeSlot || !partySize) {
    return res.status(400).json({ error: 'Missing required fields' })
  }

  const isMember = req.user.role === 'MEMBER' || req.user.role === 'ADMIN'
  const huntDate = new Date(date)

  // Parse bird counts as safe integers
  const numPheasants = Math.max(0, parseInt(pheasantsReleased) || 0)
  const numChukars = Math.max(0, parseInt(chukarsReleased) || 0)
  const numQuail = Math.max(0, parseInt(quailReleased) || 0)
  const totalBirdsCount = numPheasants + numChukars + numQuail

  // Calculate fee
  let fee = 0
  fee += calcBirdPrice('PHEASANT', numPheasants, isMember, huntDate)
  fee += calcBirdPrice('CHUKAR', numChukars, isMember, huntDate)
  fee += calcBirdPrice('QUAIL', numQuail, isMember, huntDate)
  if (guideRequested) fee += GUIDE_FEE
  if (birdCleaning) fee += BIRD_CLEANING_FEE * totalBirdsCount

  const cancellationDeadline = new Date(huntDate)
  cancellationDeadline.setHours(cancellationDeadline.getHours() - 24)

  const booking = await prisma.booking.create({
    data: {
      memberId: req.user.id,
      fieldId,
      date: huntDate,
      timeSlot,
      partySize: parseInt(partySize),
      guideRequested: !!guideRequested,
      guideId: guideRequested && guideId ? guideId : null,
      pheasantsReleased: numPheasants,
      chukarsReleased: numChukars,
      quailReleased: numQuail,
      birdCleaning: !!birdCleaning,
      trapHouse: !!trapHouse,
      status: 'CONFIRMED',
      totalFee: fee,
      cancellationDeadline,
      notes,
    },
    include: { field: true, guide: true },
  })

  // Deduct from bird balance
  const totalBirds = totalBirdsCount
  if (totalBirds > 0) {
    await prisma.member.update({
      where: { id: req.user.id },
      data: {
        seasonBirdsUsed: { increment: totalBirds },
        seasonBirdBalance: { decrement: totalBirds },
      },
    })
  }

  res.status(201).json(booking)
})

// GET /api/bookings/:id
router.get('/:id', auth, async (req, res) => {
  const booking = await prisma.booking.findUnique({
    where: { id: req.params.id },
    include: { field: true, guide: true, member: { select: { id: true, name: true, email: true } }, payments: true },
  })
  if (!booking) return res.status(404).json({ error: 'Booking not found' })
  if (req.user.role !== 'ADMIN' && booking.memberId !== req.user.id) return res.status(403).json({ error: 'Forbidden' })
  res.json(booking)
})

// PATCH /api/bookings/:id/cancel
router.patch('/:id/cancel', auth, async (req, res) => {
  const booking = await prisma.booking.findUnique({ where: { id: req.params.id } })
  if (!booking) return res.status(404).json({ error: 'Booking not found' })
  if (req.user.role !== 'ADMIN' && booking.memberId !== req.user.id) return res.status(403).json({ error: 'Forbidden' })
  if (booking.status === 'CANCELLED') return res.status(400).json({ error: 'Already cancelled' })

  const now = new Date()
  const forfeit = booking.cancellationDeadline && now > booking.cancellationDeadline

  const updated = await prisma.booking.update({
    where: { id: req.params.id },
    data: { status: 'CANCELLED', cancelledAt: now },
  })

  // Restore birds if cancelled in time
  if (!forfeit) {
    const totalBirds = booking.pheasantsReleased + booking.chukarsReleased + booking.quailReleased
    if (totalBirds > 0) {
      await prisma.member.update({
        where: { id: booking.memberId },
        data: {
          seasonBirdsUsed: { decrement: totalBirds },
          seasonBirdBalance: { increment: totalBirds },
        },
      })
    }
  }

  res.json({ booking: updated, birdsForfeited: forfeit })
})

module.exports = router
