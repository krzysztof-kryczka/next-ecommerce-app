import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import bcrypt from 'bcryptjs'

export async function POST(req: NextRequest) {
   try {
      console.log('Received request:', req.method, req.url)

      const body = await req.json()
      const { email, password, phone, country } = body

      if (!email || !password || !phone || !country) {
         return NextResponse.json({ success: false, message: 'All fields are required' }, { status: 400 })
      }

      const existingUser = await prisma.user.findUnique({
         where: { email },
      })

      if (existingUser) {
         console.log(`⚠️ Email already exists: ${email}`)
         return NextResponse.json({ success: false, message: 'Email already exists' }, { status: 400 })
      }

      const existingPhone = await prisma.user.findUnique({
         where: { phone },
      })

      if (existingPhone) {
         console.log(`⚠️ Phone number already exists: ${phone}`)
         return NextResponse.json({ success: false, message: 'Phone number already exists' }, { status: 400 })
      }

      console.log('🔵 Hashing password...')
      const hashedPassword = await bcrypt.hash(password, 10)

      const newUser = await prisma.user.create({
         data: {
            email,
            password: hashedPassword,
            phone,
            country,
         },
      })

      console.log('✅ User created successfully:', newUser)

      return NextResponse.json({ success: true, message: 'User created successfully', data: newUser }, { status: 201 })
   } catch (error) {
      console.error('❌ Error during registration:', error)
      return NextResponse.json({ success: false, message: 'Internal Server Error' }, { status: 500 })
   }
}
