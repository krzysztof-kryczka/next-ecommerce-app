import { NextResponse } from 'next/server'
import { verifyToken } from '@/lib/verifyToken'
import prisma from '@/lib/prisma'

export async function GET(req: Request) {
   console.log('🔄 API Request: GET /api/addresses')

   try {
      const secretKey = process.env.JWT_SECRET
      if (!secretKey) {
         console.error('❌ Missing JWT_SECRET')
         return NextResponse.json({ error: 'Server configuration error' }, { status: 500 })
      }

      const authHeader = req.headers.get('Authorization')
      console.log('🔍 Debug: Authorization Header:', authHeader)
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
         console.error('🚫 Invalid Authorization Header')
         return NextResponse.json({ error: 'Invalid or missing authorization header' }, { status: 401 })
      }

      const token = authHeader.split(' ')[1]
      const decoded = verifyToken(token)
      console.log('🔍 Debug: Decoded Token:', decoded)

      if (!decoded) {
         console.error('🚫 Invalid Token')
         return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
      }

      const userId = decoded.id
      const { searchParams } = new URL(req.url)
      const userIdParam = parseInt(searchParams.get('userId') || '', 10)
      console.log('🔍 Debug: userId from token:', userId, '| userId from param:', userIdParam)

      if (isNaN(userIdParam) || userId !== userIdParam) {
         console.error('🚫 Access Denied: Token userId does not match request')
         return NextResponse.json({ error: 'Access denied for this user' }, { status: 403 })
      }

      console.log('🟢 Fetching addresses for userId:', userId)
      const addresses = await prisma.address.findMany({ where: { userId } })
      console.log('📦 Retrieved addresses:', addresses)

      return NextResponse.json({ success: true, addresses }, { status: 200 })
   } catch (error) {
      console.error('❌ Server Error:', error)
      return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 })
   }
}

export async function POST(req: Request) {
   const secretKey = process.env.JWT_SECRET
   if (!secretKey) {
      console.error('Missing JWT_SECRET environment variable')
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 })
   }

   const authHeader = req.headers.get('Authorization')
   if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Invalid or missing authorization header' }, { status: 401 })
   }

   const token = authHeader.split(' ')[1]
   const decoded = verifyToken(token)
   if (!decoded) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
   }

   const userId = decoded.id
   const body = await req.json()
   const { country, province, city, postalCode, addressLine, isMain } = body

   if (!country || !province || !city || !postalCode || !addressLine) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
   }

   try {
      if (isMain) {
         await prisma.address.updateMany({
            where: { userId, isMain: true },
            data: { isMain: false },
         })
      }

      const newAddress = await prisma.address.create({
         data: { userId, country, province, city, postalCode, addressLine, isMain: isMain || false },
      })

      return NextResponse.json({ success: true, address: newAddress }, { status: 201 })
   } catch (error) {
      console.error('Server Error:', error)
      return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
   }
}
