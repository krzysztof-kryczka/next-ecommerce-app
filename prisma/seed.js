import { PrismaClient } from '../src/generated/prisma/index.js'
const prisma = new PrismaClient()

async function main() {
   const users = await prisma.user.createMany({
      data: [
         {
            email: 'john.doe@example.com',
            phone: '1234567890',
            password: 'password123',
            country: 'Polska',
         },
         {
            email: 'test@example.com',
            phone: '0987654321',
            password: 'securepass456',
            country: 'Niemcy',
         },
         {
            email: 'mark.smith@example.com',
            phone: '1122334455',
            password: 'adminpass789',
            country: 'Francja',
         },
      ],
   })

   console.info('Seed data inserted successfully:', users)
}

main()
   .catch(e => {
      console.error('Error while seeding database:', e)
      process.exit(1)
   })
   .finally(async () => {
      await prisma.$disconnect()
   })
