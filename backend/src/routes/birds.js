const express = require('express')
const prisma = require('../lib/prisma')
const { auth, adminOnly } = require('../middleware/auth')

const router = express.Router()

// GET /api/birds/inventory
router.get('/inventory', auth, async (req, res) => {
  const inventory = await prisma.birdInventory.findMany()
  res.json(inventory)
})

// PATCH /api/birds/inventory/:species (admin only)
router.patch('/inventory/:species', adminOnly, async (req, res) => {
  const { quantityOnHand } = req.body
  const species = req.params.species.toUpperCase()
  const record = await prisma.birdInventory.update({
    where: { species },
    data: { quantityOnHand: parseInt(quantityOnHand) },
  })
  res.json(record)
})

// GET /api/birds/guides
router.get('/guides', auth, async (req, res) => {
  const guides = await prisma.guide.findMany({ where: { active: true }, orderBy: { name: 'asc' } })
  res.json(guides)
})

// GET /api/birds/fields
router.get('/fields', auth, async (req, res) => {
  const fields = await prisma.field.findMany({ where: { active: true }, orderBy: { name: 'asc' } })
  res.json(fields)
})

module.exports = router
