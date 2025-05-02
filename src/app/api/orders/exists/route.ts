import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET(req: Request) {
   try {
      const url = new URL(req.url)
      const paymentIntentId = url.searchParams.get('paymentIntentId')

      if (!paymentIntentId) {
         console.error('❌ Missing paymentIntentId in request')
         return NextResponse.json({ exists: false, error: 'Missing paymentIntentId' }, { status: 400 })
      }

      const existingOrder = await prisma.order.findFirst({
         where: { paymentIntentId },
      })

      if (!existingOrder) {
         console.warn(`🔍 Order not found for paymentIntentId: ${paymentIntentId}`)
         return NextResponse.json({ exists: false, error: 'Order not found' }, { status: 404 })
      }

      return NextResponse.json({ exists: true }, { status: 200 })
   } catch (error) {
      console.error('❌ Error checking order existence:', error)
      return NextResponse.json({ exists: false, error: 'Failed to check order existence' }, { status: 500 })
   }
}
