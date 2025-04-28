import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import bcrypt from 'bcryptjs'

export async function POST(req: NextRequest) {
   console.log('Verify-password endpoint hit')

   try {
      const body = await req.json()
      console.log('Request body:', body)

      const { emailOrPhone, password } = body

      if (!emailOrPhone || !password) {
         console.error('Missing emailOrPhone or password')
         return NextResponse.json(
            { success: false, message: 'Email or phone and password are required' },
            { status: 400 },
         )
      }

      console.log('Fetching user from database')
      const user = await prisma.user.findFirst({
         where: {
            OR: [{ email: emailOrPhone }, { phone: emailOrPhone }],
         },
      })

      console.log('User fetched:', user)

      if (!user) {
         console.error('User not found')
         return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 })
      }

      console.log('Verifying password')
      const passwordMatches = await bcrypt.compare(password, user.password)
      console.log('Password matches:', passwordMatches)

      if (!passwordMatches) {
         console.error('Invalid password')
         return NextResponse.json({ success: false, message: 'Invalid credentials' }, { status: 401 })
      }

      return NextResponse.json(
         { success: true, message: 'Login successful', data: { id: user.id, email: user.email } },
         { status: 200 },
      )
   } catch (error) {
      console.error('Error in verify-password API:', error) // Log błędu w obsłudze endpointu
      return NextResponse.json({ success: false, message: 'Internal Server Error' }, { status: 500 })
   }
}
