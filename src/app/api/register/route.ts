import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { handleError } from '@/lib/helpers'
import prisma from '@/lib/prisma'

export async function POST(req: NextRequest) {
   try {
      const body = await req.json()
      const { email, password, phone, country } = body

      if (!email || !password || !phone || !country) {
         return NextResponse.json({ success: false, message: 'All fields are required' }, { status: 400 })
      }

      const existingUser = await prisma.user.findUnique({
         where: { email },
      })

      if (existingUser) {
         return NextResponse.json({ success: false, message: 'Email already exists' }, { status: 400 })
      }

      const existingPhone = await prisma.user.findUnique({
         where: { phone },
      })

      if (existingPhone) {
         return NextResponse.json({ success: false, message: 'Phone number already exists' }, { status: 400 })
      }

      const hashedPassword = await bcrypt.hash(password, 10)

      const newUser = await prisma.user.create({
         data: {
            email,
            password: hashedPassword,
            phone,
            country,
         },
      })

      return NextResponse.json({ success: true, message: 'User created successfully', data: newUser }, { status: 201 })
   } catch (error) {
      return handleError(error)
   }
}
