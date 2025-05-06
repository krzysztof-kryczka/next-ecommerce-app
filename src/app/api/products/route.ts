import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET(req: NextRequest) {
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
      console.error('❌ Error fetching products:', error)
      return NextResponse.json({ success: false, message: 'Internal Server Error' }, { status: 500 })
   }
}
