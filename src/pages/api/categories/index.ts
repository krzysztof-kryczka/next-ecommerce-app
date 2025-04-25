import { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient } from '../../../generated/prisma'
import { sendResponse } from '@/utils/apiResponse'

const prisma = new PrismaClient()

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
   try {
      if (req.method !== 'GET') {
         return sendResponse(res, 405, false, 'Method not allowed')
      }

      const categories = await prisma.category.findMany({
         select: {
            id: true,
            name: true,
            description: true,
            image: true,
            exploreInfo: true,
         },
      })

      res.status(200).json(categories)
   } catch (error) {
      console.error('Error fetching categories:', error)
      return sendResponse(res, 500, false, 'Internal Server Error')
   }
}
