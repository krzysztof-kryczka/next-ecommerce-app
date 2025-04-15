import type { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient } from '../../generated/prisma'
import { sendResponse } from '../../utils/apiResponse'

const prisma = new PrismaClient()

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
   if (req.method !== 'POST') {
      return sendResponse(res, 405, false, 'Method not allowed')
   }

   const { emailOrPhone } = req.body

   try {
      const user = await prisma.user.findFirst({
         where: {
            OR: [
               { email: emailOrPhone },
               { phone: emailOrPhone },
            ],
         },
      })

      if (user) {
         return sendResponse(res, 200, true, 'User exists')
      } else {
         return sendResponse(res, 404, false, 'User not found')
      }
   } catch (error) {
      console.error(error)
      return sendResponse(res, 500, false, 'Internal server error')
   }
}
