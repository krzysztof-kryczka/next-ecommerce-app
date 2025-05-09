import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { handleError } from '@/lib/helpers'
import { authenticateRequest } from '@/lib/authenticateRequest'
import { CartClearItem } from '@/types/CartClearItem'

export async function DELETE(req: Request) {
   try {
      const userId = await authenticateRequest(req)
      if (!userId) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })

      const { items } = await req.json()

      await prisma.cartItem.deleteMany({
         where: {
            cart: { userId },
            productId: { in: items.map((item: CartClearItem) => item.id) },
         },
      })

      return NextResponse.json({ success: true })
   } catch (error) {
      return handleError(error)
   }
}
