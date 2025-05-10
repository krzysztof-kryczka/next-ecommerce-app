import { NextResponse } from 'next/server'
import { handleError } from '@/lib/helpers'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import prisma from '@/lib/prisma'

export async function GET(req: Request) {
   try {
      const session = await getServerSession(authOptions)
      if (!session?.user) {
         return NextResponse.json({ success: false, message: 'Unauthorized: No session found' }, { status: 401 })
      }
      const userId = parseInt(session.user.id, 10)

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
