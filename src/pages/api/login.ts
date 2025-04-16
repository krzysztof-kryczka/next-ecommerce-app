import type { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient } from '../../generated/prisma'
import { sendResponse } from '../../utils/apiResponse'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

type Data = {
   message: string
   success: boolean
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
   if (req.method !== 'POST') {
      return sendResponse(res, 405, false, 'Method not allowed')
   }

   const { emailOrPhone, password, } = req.body

   if (!emailOrPhone || !password) {
      return sendResponse(res, 400, false, 'Email or phone and password are required')
   }

   try {
      const user = await prisma.user.findFirst({
         where: {
            OR: [{ email: emailOrPhone, }, { phone: emailOrPhone, },],
         },
      })
      console.log('User fetched from database:', user)
      if (!user) {
         return sendResponse(res, 404, false, 'User not found')
      }

      const passwordMatches = await bcrypt.compare(password, user.password)

      if (!passwordMatches) {
         return sendResponse(res, 401, false, 'Invalid credentials')
      }

      if (passwordMatches) {
         sendResponse(res, 200, true, 'Login successful', { id: user.id, email: user.email, })
      }
   } catch (error) {
      console.error(error)
      return sendResponse(res, 500, false, 'Internal Server Error')
   }
}
