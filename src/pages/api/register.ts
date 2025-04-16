import type { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient } from '../../generated/prisma'
import { sendResponse } from '../../utils/apiResponse'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

type Data = {
   message: string
   user?: object
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
   if (req.method !== 'POST') {
      return sendResponse(res, 405, false, 'Method not allowed')
   }

   const { email, password, phone, country, } = req.body

   if (!email || !password || !phone || !country) {
      return sendResponse(res, 400, false, 'All fields are required')
   }

   try {
      const existingUser = await prisma.user.findUnique({
         where: { email, },
      })
      if (existingUser) {
         return sendResponse(res, 400, false, 'Email already exists')
      }

      const existingPhone = await prisma.user.findUnique({
         where: { phone, },
      })
      if (existingPhone) {
         return sendResponse(res, 400, false, 'Phone number already exists')
      }

      const hashedPassword = await bcrypt.hash(password, 10)

      const newUser = await prisma.user.create({
         data: {
            email,
            password: hashedPassword,
            phone,
            country,
         },
      })
      sendResponse(res, 201, true, 'User created successfully', newUser)
   } catch (error) {
      console.error(error)
      return sendResponse(res, 500, false, 'Internal Server Error')
   }
}
