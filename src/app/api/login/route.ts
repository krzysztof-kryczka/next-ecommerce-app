import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { handleError } from '@/lib/helpers'
import prisma from '@/lib/prisma'

export async function POST(req: NextRequest) {
   try {
      const body = await req.json()

      const { emailOrPhone, password } = body

      if (!emailOrPhone || !password) {
         return NextResponse.json(
            { success: false, message: 'Email or phone and password are required' },
            { status: 400 },
         )
      }

      const user = await prisma.user.findFirst({
         where: {
            OR: [{ email: emailOrPhone }, { phone: emailOrPhone }],
         },
      })

      if (!user) {
         return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 })
      }

      const passwordMatches = await bcrypt.compare(password, user.password)

      if (!passwordMatches) {
         return NextResponse.json({ success: false, message: 'Invalid credentials' }, { status: 401 })
      }

      return NextResponse.json(
         { success: true, message: 'Login successful', data: { id: user.id, email: user.email } },
         { status: 200 },
      )
   } catch (error) {
      return handleError(error)
   }
}
