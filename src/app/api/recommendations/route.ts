import { NextResponse } from 'next/server'
import { handleError } from '@/lib/helpers'
import prisma from '@/lib/prisma'

export async function GET() {
   try {
      const totalProducts = await prisma.product.count()

      if (totalProducts === 0) {
         return NextResponse.json({ success: true, data: [] }, { status: 200 })
      }

      const randomIds = new Set<number>()
      while (randomIds.size < Math.min(6, totalProducts)) {
         randomIds.add(Math.floor(Math.random() * totalProducts) + 1)
      }

      const recommendations = await prisma.product.findMany({
         where: { id: { in: Array.from(randomIds) } },
         select: {
            id: true,
            name: true,
            price: true,
            categoryId: true,
            imageUrl: true,
            createdAt: true,
            brandId: true,
            variants: {
               select: {
                  id: true,
                  color: true,
                  stock: true,
               },
            },
         },
      })

      return NextResponse.json({ success: true, data: recommendations }, { status: 200 })
   } catch (error) {
      return handleError(error)
   }
}
