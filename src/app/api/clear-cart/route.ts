import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '../../../pages/api/auth/[...nextauth]'

export async function DELETE(req: Request) {
   try {
      const session = await getServerSession(authOptions)
      if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

      const { items } = await req.json()

      await prisma.cartItem.deleteMany({
         where: {
            cart: { userId: session.user.id },
            productId: { in: items.map(item => item.id) },
         },
      })

      return NextResponse.json({ success: true })
   } catch (error) {
      console.error('❌ Error clearing cart:', error)
      return NextResponse.json({ error: 'Failed to clear cart' }, { status: 500 })
   }
}
