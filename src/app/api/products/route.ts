import { NextResponse } from 'next/server'
import { handleError } from '@/lib/helpers'
import prisma from '@/lib/prisma'

export async function GET() {
   try {
      const products = await prisma.product.findMany({
         select: {
            id: true,
            name: true,
            price: true,
            categoryId: true,
            imageUrl: true,
            createdAt: true,
            brandId: true,
         },
      })

      return NextResponse.json({ success: true, data: products }, { status: 200 })
   } catch (error) {
      return handleError(error)
   }
}
