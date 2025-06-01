import { NextResponse } from 'next/server'
import { handleError } from '@/lib/helpers'
import prisma from '@/lib/prisma'

export async function PATCH(req: Request) {
   try {
      const { items } = await req.json()

      for (const item of items) {
         if (!item.variantId) {
            continue
         }

         await prisma.productVariant.update({
            where: { id: item.variantId },
            data: {
               stock: { decrement: item.quantityPurchased },
            },
         })
      }

      return NextResponse.json({ success: true })
   } catch (error) {
      return handleError(error)
   }
}
