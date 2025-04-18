import { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient } from '../../../generated/prisma'
import { sendResponse } from '@/utils/apiResponse'

const prisma = new PrismaClient()

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
   try {
      if (req.method !== 'GET') {
         return sendResponse(res, 405, false, 'Method not allowed')
      }

      const { id } = req.query

      const product = await prisma.product.findUnique({
         where: { id: parseInt(id as string) },
         select: {
            id: true,
            name: true,
            price: true,
            categoryId: true,
            imageUrl: true,
            description: true,
            createdAt: true,
         },
      })

      if (!product) {
         return res.status(404).json({ success: false, message: 'Product not found' })
      }

      // Generacja losowej daty początkowej dostawy (1-7 dni od dzisiaj)
      const today = new Date()
      const randomDaysToAdd = Math.floor(Math.random() * 7) + 1 // Losowa liczba dni
      const startDate = new Date(today)
      startDate.setDate(today.getDate() + randomDaysToAdd)

      // Zakładamy, że dostawa ma przedział 3 dni
      const endDate = new Date(startDate)
      endDate.setDate(startDate.getDate() + 3)

      const deliveryRange = {
         startDate: startDate.toLocaleDateString('en-US', { day: 'numeric', month: 'short' }),
         endDate: endDate.toLocaleDateString('en-US', { day: 'numeric', month: 'short' }),
      }

      const transformedProduct = {
         ...product,
         createdAt: product.createdAt.toISOString(),
         deliveryDateRange: deliveryRange,
      }

      return res.status(200).json({ success: true, data: transformedProduct })
      // sendResponse(res, 200, true, 'Product fetched successfully', transformedProduct)
   } catch (error) {
      console.error('Error fetching product details:', error)
      return sendResponse(res, 500, false, 'Internal Server Error')
   }
}
