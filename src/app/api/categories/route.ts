import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { Category } from '@/types/Category'

export async function GET(req: NextRequest) {
   try {
      const categories: Category[] = await prisma.category.findMany({
         select: {
            id: true,
            name: true,
            description: true,
            image: true,
            exploreInfo: true,
         },
      })

      return NextResponse.json(categories, { status: 200 })
   } catch (error) {
      console.error('Error fetching categories:', error)
      return NextResponse.json({ success: false, message: 'Internal Server Error' }, { status: 500 })
   }
}
