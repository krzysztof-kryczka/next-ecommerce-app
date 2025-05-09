import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { authenticateRequest } from '@/lib/authenticateRequest'
import { handleError } from '@/lib/helpers'

export async function GET(req: Request) {
   try {
      const userId = await authenticateRequest(req)
      if (!userId) {
         return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
      }

      const url = new URL(req.url)
      const paymentIntentId = url.searchParams.get('paymentIntentId')

      if (!paymentIntentId) {
         console.error('❌ Missing paymentIntentId')
         return NextResponse.json({ exists: false, error: 'Missing paymentIntentId' }, { status: 400 })
      }

      const existingOrder = await prisma.order.findFirst({
         where: {
            paymentIntentId,
            userId,
         },
      })

      if (!existingOrder) {
         return NextResponse.json({ exists: false }, { status: 200 })
      }

      return NextResponse.json({ exists: true }, { status: 200 })
   } catch (error) {
      return handleError(error)
   }
}
