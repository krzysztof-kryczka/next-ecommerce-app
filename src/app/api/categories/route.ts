import { NextResponse } from 'next/server'
import { Category } from '@/types/Category'
import { handleError } from '@/lib/helpers'
import prisma from '@/lib/prisma'

export async function GET() {
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
      return handleError(error)
   }
}
