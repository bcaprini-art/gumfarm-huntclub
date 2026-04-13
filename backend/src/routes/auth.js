const express = require('express')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const prisma = require('../lib/prisma')
const { auth } = require('../middleware/auth')

const router = express.Router()

// POST /api/auth/register
router.post('/register', async (req, res) => {
  const { email, name, password, phone } = req.body
  if (!email || !name || !password) return res.status(400).json({ error: 'Missing required fields' })

  const existing = await prisma.member.findUnique({ where: { email } })
  if (existing) return res.status(409).json({ error: 'Email already in use' })

  const hashed = await bcrypt.hash(password, 10)
  const member = await prisma.member.create({
    data: { email, name, password: hashed, phone, role: 'MEMBER', type: 'INDIVIDUAL' },
  })

  const token = jwt.sign({ id: member.id }, process.env.JWT_SECRET, { expiresIn: '7d' })
  res.json({ token, member: sanitize(member) })
})

// POST /api/auth/login
router.post('/login', async (req, res) => {
  const { email, password } = req.body
  const member = await prisma.member.findUnique({ where: { email } })
  if (!member) return res.status(401).json({ error: 'Invalid credentials' })

  const valid = await bcrypt.compare(password, member.password)
  if (!valid) return res.status(401).json({ error: 'Invalid credentials' })

  const token = jwt.sign({ id: member.id }, process.env.JWT_SECRET, { expiresIn: '7d' })
  res.json({ token, member: sanitize(member) })
})

// GET /api/auth/me
router.get('/me', auth, async (req, res) => {
  res.json(sanitize(req.user))
})

// POST /api/auth/waiver
router.post('/waiver', auth, async (req, res) => {
  const member = await prisma.member.update({
    where: { id: req.user.id },
    data: { waiverSigned: true, waiverSignedAt: new Date() },
  })
  res.json(sanitize(member))
})

function sanitize(m) {
  const { password, ...rest } = m
  return rest
}

module.exports = router
