import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { handleError } from '@/lib/helpers'

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
