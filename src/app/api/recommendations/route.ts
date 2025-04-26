import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { ProductCardProps } from '@/types/ProductCardProps'

export async function GET(req: NextRequest) {
   try {
      const products = await prisma.$queryRaw<
         ProductCardProps[]
      >`SELECT id, name, price, "imageUrl", "categoryId" FROM "Product" ORDER BY RANDOM() LIMIT 6`
      return NextResponse.json(products, { status: 200 })
   } catch (error) {
      console.error('Failed to fetch recommendations:', error)
      return NextResponse.json({ message: 'Failed to fetch recommendations' }, { status: 500 })
   }
}
