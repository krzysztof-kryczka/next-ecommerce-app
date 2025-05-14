import { NextResponse } from 'next/server'
import { handleError } from '@/lib/helpers'
import prisma from '@/lib/prisma'

export async function GET() {
   try {
      const brands = await prisma.brand.findMany()
      return NextResponse.json(brands)
   } catch (error) {
      return handleError(error)
   }
}
