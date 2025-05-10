import { NextRequest, NextResponse } from 'next/server'
import { handleError } from '@/lib/helpers'
import prisma from '@/lib/prisma'

export async function POST(req: NextRequest) {
   try {
      const body = await req.json()
      const { emailOrPhone } = body

      if (!emailOrPhone) {
         return NextResponse.json({ success: false, message: 'Email or phone is required' }, { status: 400 })
      }

      const user = await prisma.user.findFirst({
         where: {
            OR: [{ email: emailOrPhone }, { phone: emailOrPhone }],
         },
      })

      if (!user) {
         return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 })
      }

      return NextResponse.json({ success: true, message: 'User exists' }, { status: 200 })
   } catch (error) {
      return handleError(error)
   }
}
