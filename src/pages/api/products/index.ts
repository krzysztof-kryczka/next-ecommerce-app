import { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient } from '../../../generated/prisma'
import { sendResponse } from '@/utils/apiResponse'

const prisma = new PrismaClient()

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
   try {
      if (req.method !== 'GET') {
         return sendResponse(res, 405, false, 'Method not allowed')
      }

      const products = await prisma.product.findMany({
         select: {
            id: true,
            name: true,
            price: true,
            categoryId: true,
            imageUrl: true,
            createdAt: true,
         },
      })

      res.status(200).json(products)
      // sendResponse(res, 200, true, 'Products fetched successfully', products)
   } catch (error) {
      console.error('Error fetching products:', error)
      return sendResponse(res, 500, false, 'Internal Server Error')
   }
}
