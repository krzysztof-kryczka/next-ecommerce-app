import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET(req: NextRequest, context: { params: Promise<{ id: string }> }) {
   // https://stackoverflow.com/a/79242776
   const { id } = await context.params
   const productId = Number(id)

   if (isNaN(productId)) {
      return NextResponse.json({ success: false, message: 'Product ID must be a number' }, { status: 400 })
   }

   try {
      const product = await prisma.product.findUnique({
         where: { id: productId },
         select: {
            id: true,
            name: true,
            price: true,
            categoryId: true,
            stock: true,
            imageUrl: true,
            description: true,
            createdAt: true,
         },
      })

      if (!product) {
         return NextResponse.json({ success: false, message: 'Product not found' }, { status: 404 })
      }

      // Generowanie zakresu dostawy
      const today = new Date()
      const randomDaysToAdd = Math.floor(Math.random() * 7) + 1
      const startDate = new Date(today)
      startDate.setDate(today.getDate() + randomDaysToAdd)
      // Zakładamy, że dostawa ma przedział 3 dni
      const endDate = new Date(startDate)
      endDate.setDate(startDate.getDate() + 3)

      const deliveryRange = {
         startDate: startDate.toLocaleDateString('en-US', { day: 'numeric', month: 'short' }),
         endDate: endDate.toLocaleDateString('en-US', { day: 'numeric', month: 'short' }),
      }

      return NextResponse.json(
         {
            success: true,
            data: {
               ...product,
               createdAt: product.createdAt.toISOString(),
               deliveryDateRange: deliveryRange,
            },
         },
         { status: 200 },
      )
   } catch (error) {
      return NextResponse.json({ success: false, message: 'Internal Server Error' }, { status: 500 })
   }
}
