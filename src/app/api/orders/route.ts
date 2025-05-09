import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { authenticateRequest } from '@/lib/authenticateRequest'
import { handleError } from '@/lib/helpers'
import { OrderItemInput } from '@/types/OrderItemInput'

export async function POST(req: Request) {
   try {
      const userId = await authenticateRequest(req)
      if (!userId) {
         return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
      }

      const body = await req.json()

      if (!body || Object.keys(body).length === 0) {
         return NextResponse.json({ success: false, error: 'Empty request body' }, { status: 400 })
      }

      const newOrder = await prisma.order.create({
         data: {
            userId,
            paymentIntentId: body.paymentIntentId,
            status: body.status,
            items: {
               create: body.items.map((item: OrderItemInput) => ({
                  // orderId: undefined,
                  productId: item.productId,
                  quantity: item.quantity,
                  priceAtPurchase: item.price,
               })),
            },
            //createdAt: new Date(),
         },
      })

      return NextResponse.json({ success: true, data: newOrder })
   } catch (error) {
      return handleError(error)
   }
}

export async function GET(req: Request) {
   try {
      const userId = await authenticateRequest(req)
      if (!userId) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })

      const orders = await prisma.order.findMany({
         where: { userId },
         include: { items: { include: { product: true } } },
      })

      if (!orders.length) return NextResponse.json({ success: false, error: 'Brak zamówień' }, { status: 404 })

      const formattedOrders = orders.map(order => ({
         id: order.id,
         orderNumber: `INV/${new Date().getFullYear()}/${order.paymentIntentId}`,
         date: order.createdAt.toISOString(),
         amount: order.items.reduce((acc, item) => acc + Number(item.priceAtPurchase) * item.quantity, 0).toFixed(2),
         items: order.items.map(item => ({
            productName: item.product.name,
            quantity: item.quantity,
            priceAtPurchase: Number(item.priceAtPurchase).toFixed(2),
            imageUrl: item.product.imageUrl[0],
         })),
      }))

      return NextResponse.json({ success: true, data: formattedOrders }, { status: 200 })
   } catch (error) {
      return handleError(error)
   }
}
