import { NextResponse } from 'next/server'
import { handleError } from '@/lib/helpers'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { CartClearItem } from '@/types/CartClearItem'
import prisma from '@/lib/prisma'

export async function DELETE(req: Request) {
   try {
      const session = await getServerSession(authOptions)
      if (!session?.user) {
         return NextResponse.json({ success: false, message: 'Unauthorized: No session found' }, { status: 401 })
      }
      const userId = parseInt(session.user.id, 10)

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
