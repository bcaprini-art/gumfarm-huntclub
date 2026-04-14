// One-time setup route - remove after use
const express = require('express')
const prisma = require('../lib/prisma')
const bcrypt = require('bcryptjs')

const router = express.Router()

router.post('/seed', async (req, res) => {
  const secret = req.headers['x-setup-secret']
  if (secret !== 'gumfarm-setup-2024') return res.status(403).json({ error: 'Forbidden' })

  // Update admin role
  await prisma.member.updateMany({
    where: { email: 'admin@gumfarmhuntclub.com' },
    data: { role: 'ADMIN', waiverSigned: true }
  })

  // Delete old placeholder fields
  await prisma.field.deleteMany({})

  // Create real fields
  const fields = [
    { id: 'field-1', name: 'Field 1' },
    { id: 'field-2a', name: 'Field 2A' },
    { id: 'field-2b', name: 'Field 2B' },
    { id: 'field-2c', name: 'Field 2C' },
    { id: 'field-3', name: 'Field 3' },
    { id: 'field-4', name: 'Field 4' },
    { id: 'field-4a', name: 'Field 4A' },
    { id: 'field-5', name: 'Field 5' },
    { id: 'field-6', name: 'Field 6' },
    { id: 'field-7a', name: 'Field 7A' },
    { id: 'field-7b', name: 'Field 7B' },
  ]

  for (const f of fields) {
    await prisma.field.upsert({
      where: { id: f.id },
      update: { name: f.name, active: true, maxHunters: 6 },
      create: { id: f.id, name: f.name, description: `${f.name} — native grasses and sorghum habitat`, maxHunters: 6, active: true }
    })
  }

  // Create guides
  await prisma.guide.deleteMany({})
  for (const name of ['Jake', 'Mike', 'Tom', 'Dave', 'Randy']) {
    await prisma.guide.create({ data: { name, active: true } })
  }

  // Create bird inventory
  for (const [species, qty] of [['PHEASANT', 200], ['CHUKAR', 100], ['QUAIL', 150]]) {
    await prisma.birdInventory.upsert({
      where: { species },
      update: { quantityOnHand: qty },
      create: { species, quantityOnHand: qty }
    })
  }

  // Create sample member
  const pw = await bcrypt.hash('Member1234!', 10)
  await prisma.member.upsert({
    where: { email: 'john@example.com' },
    update: {},
    create: { email: 'john@example.com', name: 'John Smith', password: pw, phone: '815-555-0101', type: 'INDIVIDUAL', role: 'MEMBER', waiverSigned: true, waiverSignedAt: new Date(), seasonBirdBalance: 20 }
  })

  res.json({ ok: true, fields: fields.length, message: 'Seed complete' })
})

module.exports = router
