const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding Gumfarm Hunt Club database...')

  // Fields
  const fields = await Promise.all(
    ['Field A', 'Field B', 'Field C', 'Field D', 'Field E', 'Field F', 'Field G'].map((name, i) =>
      prisma.field.upsert({
        where: { id: `field-${String.fromCharCode(65 + i).toLowerCase()}` },
        update: {},
        create: {
          id: `field-${String.fromCharCode(65 + i).toLowerCase()}`,
          name,
          description: `${name} — native grasses and sorghum habitat`,
          maxHunters: 6,
          active: true,
        },
      })
    )
  )
  console.log(`✅ ${fields.length} fields created`)

  // Guides
  const guideNames = ['Jake', 'Mike', 'Tom', 'Dave', 'Randy']
  const guides = await Promise.all(
    guideNames.map((name, i) =>
      prisma.guide.upsert({
        where: { id: `guide-${name.toLowerCase()}` },
        update: {},
        create: {
          id: `guide-${name.toLowerCase()}`,
          name,
          active: true,
        },
      })
    )
  )
  console.log(`✅ ${guides.length} guides created`)

  // Bird Inventory
  await Promise.all([
    prisma.birdInventory.upsert({
      where: { species: 'PHEASANT' },
      update: {},
      create: { species: 'PHEASANT', quantityOnHand: 200 },
    }),
    prisma.birdInventory.upsert({
      where: { species: 'CHUKAR' },
      update: {},
      create: { species: 'CHUKAR', quantityOnHand: 100 },
    }),
    prisma.birdInventory.upsert({
      where: { species: 'QUAIL' },
      update: {},
      create: { species: 'QUAIL', quantityOnHand: 150 },
    }),
  ])
  console.log('✅ Bird inventory created')

  // Admin user
  const adminPassword = await bcrypt.hash('Admin1234!', 10)
  await prisma.member.upsert({
    where: { email: 'admin@gumfarmhuntclub.com' },
    update: {},
    create: {
      email: 'admin@gumfarmhuntclub.com',
      name: 'Amber Gum',
      password: adminPassword,
      phone: '815-739-0612',
      type: 'INDIVIDUAL',
      role: 'ADMIN',
      waiverSigned: true,
      waiverSignedAt: new Date(),
      seasonBirdBalance: 0,
    },
  })
  console.log('✅ Admin user created (admin@gumfarmhuntclub.com / Admin1234!)')

  // Sample individual member
  const memberPassword = await bcrypt.hash('Member1234!', 10)
  await prisma.member.upsert({
    where: { email: 'john@example.com' },
    update: {},
    create: {
      email: 'john@example.com',
      name: 'John Smith',
      password: memberPassword,
      phone: '815-555-0101',
      type: 'INDIVIDUAL',
      role: 'MEMBER',
      waiverSigned: true,
      waiverSignedAt: new Date(),
      seasonBirdBalance: 20,
    },
  })

  // Sample corporate account + member
  const corp = await prisma.corporateAccount.upsert({
    where: { id: 'corp-acme' },
    update: {},
    create: {
      id: 'corp-acme',
      name: 'Acme Industries',
      annualDue: 2500,
      paidAnnualDue: true,
    },
  })

  await prisma.member.upsert({
    where: { email: 'corporate@example.com' },
    update: {},
    create: {
      email: 'corporate@example.com',
      name: 'Bob Johnson',
      password: memberPassword,
      phone: '815-555-0202',
      type: 'CORPORATE',
      role: 'MEMBER',
      corporateAccountId: corp.id,
      waiverSigned: true,
      waiverSignedAt: new Date(),
      seasonBirdBalance: 50,
    },
  })

  console.log('✅ Sample members created')
  console.log('')
  console.log('🎯 Seed complete! Login credentials:')
  console.log('   Admin:     admin@gumfarmhuntclub.com / Admin1234!')
  console.log('   Member:    john@example.com / Member1234!')
  console.log('   Corporate: corporate@example.com / Member1234!')
}

main()
  .catch(e => { console.error(e); process.exit(1) })
  .finally(() => prisma.$disconnect())
