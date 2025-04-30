import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '../../../pages/api/auth/[...nextauth]'

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

      const updatedData = await req.json()

      const updatedUser = await prisma.user.update({
         where: { email: session.user.email },
         data: {
            name: updatedData.name,
            phone: updatedData.phone,
            country: updatedData.country,
         },
      })

      return NextResponse.json({ message: 'User updated successfully', user: updatedUser }, { status: 200 })
   } catch (error) {
      return NextResponse.json({ message: 'Error updating user' }, { status: 500 })
   }
}
