import { NextResponse } from 'next/server'
import { handleError } from '@/lib/helpers'
import prisma from '@/lib/prisma'

export async function PATCH(req: Request) {
   try {
      const { items } = await req.json()

      for (const item of items) {
         await prisma.product.update({
            where: { id: item.productId },
            data: { stock: { decrement: item.quantityPurchased } },
         })
      }

      return NextResponse.json({ success: true })
   } catch (error) {
      return handleError(error)
   }
}
