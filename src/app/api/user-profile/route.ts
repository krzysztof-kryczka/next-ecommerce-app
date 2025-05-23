import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import bcrypt from 'bcryptjs'
import { User } from '@/types/User'
import { handleError } from '@/lib/helpers'
import { authOptions } from '@/utils/authOptions'
import prisma from '@/lib/prisma'

export async function GET() {
   try {
      const session = await getServerSession(authOptions)
      if (!session?.user?.email) {
         return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
      }

      const user = await prisma.user.findUnique({
         where: { email: session.user.email },
      })

      if (!user) {
         return NextResponse.json({ message: 'User not found' }, { status: 404 })
      }

      return NextResponse.json(user, { status: 200 })
   } catch (error) {
      return handleError(error)
   }
}

export async function PUT(req: Request) {
   try {
      const session = await getServerSession(authOptions)

      if (!session?.user?.email) {
         return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
      }

      const body = await req.json()
      const updatedData: Partial<User> = {}

      if (body.email && body.email !== session.user.email) {
         const existingUser = await prisma.user.findUnique({ where: { email: body.email } })
         if (existingUser) {
            return NextResponse.json({ message: 'Email already in use' }, { status: 400 })
         }
         updatedData.email = body.email
      }

      if (body.name) updatedData.name = body.name
      if (body.phone) updatedData.phone = body.phone
      if (body.country) updatedData.country = body.country

      // Szyfrowanie hasła tylko gdy użytkownik przesłał nowe
      if (body.password && !body.password.startsWith('$2b$')) {
         updatedData.password = await bcrypt.hash(body.password, 10)
      }

      if (Object.keys(updatedData).length === 0) {
         return NextResponse.json({ message: 'No fields provided for update' }, { status: 400 })
      }

      const updatedUser = await prisma.user.update({
         where: { email: session.user.email },
         data: updatedData,
      })

      return NextResponse.json({ message: 'User updated successfully', user: updatedUser }, { status: 200 })
   } catch (error) {
      return handleError(error)
   }
}
