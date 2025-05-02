import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '../../../pages/api/auth/[...nextauth]'

export async function POST(req: Request) {
   try {
      const session = await getServerSession(authOptions)
      if (!session || !session.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

      const { items, paymentIntentId, status } = await req.json()

      const newOrder = await prisma.order.create({
         data: {
            userId: session.user.id,
            status,
            paymentIntentId,
            items: {
               create: items.map(item => ({
                  productId: item.productId,
                  quantity: item.quantity,
                  priceAtPurchase: item.price,
               })),
            },
         },
      })

      return NextResponse.json(newOrder, { status: 201 })
   } catch (error) {
      console.error('❌ Error creating order:', error)
      return NextResponse.json({ error: 'Failed to create order' }, { status: 500 })
   }
}
