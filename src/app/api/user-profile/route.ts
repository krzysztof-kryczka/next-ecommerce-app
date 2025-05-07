import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '../../../pages/api/auth/[...nextauth]'
import bcrypt from 'bcryptjs'
import { User } from '@/types/User'

export async function GET(req: Request) {
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
      return NextResponse.json({ message: 'Error fetching user data' }, { status: 500 })
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
         console.log('🔵 Hashing new password...')
         updatedData.password = await bcrypt.hash(body.password, 10)
      }

      if (Object.keys(updatedData).length === 0) {
         return NextResponse.json({ message: 'No fields provided for update' }, { status: 400 })
      }

      const updatedUser = await prisma.user.update({
         where: { email: session.user.email },
         data: updatedData,
      })

      console.log('✅ User updated successfully:', updatedUser)
      return NextResponse.json({ message: 'User updated successfully', user: updatedUser }, { status: 200 })
   } catch (error) {
      console.error('❌ Error updating user:', error)
      return NextResponse.json({ message: 'Error updating user' }, { status: 500 })
   }
}
