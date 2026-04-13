const jwt = require('jsonwebtoken')
const prisma = require('../lib/prisma')

const auth = async (req, res, next) => {
  const token = req.headers.authorization?.replace('Bearer ', '')
  if (!token) return res.status(401).json({ error: 'Unauthorized' })

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET)
    const member = await prisma.member.findUnique({ where: { id: payload.id } })
    if (!member) return res.status(401).json({ error: 'Unauthorized' })
    req.user = member
    next()
  } catch {
    res.status(401).json({ error: 'Invalid token' })
  }
}

const adminOnly = async (req, res, next) => {
  await auth(req, res, () => {
    if (req.user?.role !== 'ADMIN') return res.status(403).json({ error: 'Admin only' })
    next()
  })
}

module.exports = { auth, adminOnly }
