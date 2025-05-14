import { NextResponse } from 'next/server'
import { getUserId, handleError } from '@/lib/helpers'
import prisma from '@/lib/prisma'

export async function GET(req: Request) {
   try {
      const userId = await getUserId()
      if (!userId) return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 })

      const url = new URL(req.url)
      const paymentIntentId = url.searchParams.get('paymentIntentId')

      if (!paymentIntentId) {
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
