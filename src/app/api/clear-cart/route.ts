import { NextResponse } from 'next/server'
import { getUserId, handleError } from '@/lib/helpers'
import { CartClearItem } from '@/types/CartClearItem'
import prisma from '@/lib/prisma'

export async function DELETE(req: Request) {
   try {
      const userId = await getUserId()
      if (!userId) return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 })

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
