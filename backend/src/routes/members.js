const express = require('express')
const prisma = require('../lib/prisma')
const { auth, adminOnly } = require('../middleware/auth')

const router = express.Router()

// GET /api/members (admin only)
router.get('/', adminOnly, async (req, res) => {
  const members = await prisma.member.findMany({
    select: {
      id: true, email: true, name: true, phone: true, type: true, role: true,
      seasonBirdBalance: true, seasonBirdsUsed: true, waiverSigned: true,
      createdAt: true, corporateAccountId: true,
      corporateAccount: { select: { id: true, name: true } },
    },
    orderBy: { name: 'asc' },
  })
  res.json(members)
})

// GET /api/members/:id
router.get('/:id', auth, async (req, res) => {
  if (req.user.role !== 'ADMIN' && req.user.id !== req.params.id) return res.status(403).json({ error: 'Forbidden' })
  const member = await prisma.member.findUnique({
    where: { id: req.params.id },
    select: {
      id: true, email: true, name: true, phone: true, type: true, role: true,
      seasonBirdBalance: true, seasonBirdsUsed: true, waiverSigned: true, waiverSignedAt: true,
      createdAt: true, corporateAccountId: true,
      corporateAccount: { select: { id: true, name: true, annualDue: true, paidAnnualDue: true } },
      bookings: { include: { field: true }, orderBy: { date: 'desc' }, take: 10 },
      payments: { orderBy: { createdAt: 'desc' }, take: 10 },
    },
  })
  if (!member) return res.status(404).json({ error: 'Member not found' })
  res.json(member)
})

// PATCH /api/members/:id/birds (admin: adjust bird balance)
router.patch('/:id/birds', adminOnly, async (req, res) => {
  const { seasonBirdBalance } = req.body
  const member = await prisma.member.update({
    where: { id: req.params.id },
    data: { seasonBirdBalance: parseInt(seasonBirdBalance) },
  })
  res.json({ id: member.id, seasonBirdBalance: member.seasonBirdBalance })
})

// PATCH /api/members/:id (admin: update member details)
router.patch('/:id', adminOnly, async (req, res) => {
  const { name, phone, type, role, seasonBirdBalance } = req.body
  const data = {}
  if (name) data.name = name
  if (phone) data.phone = phone
  if (type) data.type = type
  if (role) data.role = role
  if (seasonBirdBalance !== undefined) data.seasonBirdBalance = parseInt(seasonBirdBalance)

  const member = await prisma.member.update({ where: { id: req.params.id }, data })
  const { password, ...safe } = member
  res.json(safe)
})

module.exports = router
