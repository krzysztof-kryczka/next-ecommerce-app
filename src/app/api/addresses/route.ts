import { NextResponse } from 'next/server'
import { getUserId, handleError, validateAddressData } from '@/lib/helpers'
import prisma from '@/lib/prisma'

export async function GET(req: Request) {
   try {
      const userId = await getUserId()
      if (!userId) return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 })

      const { searchParams } = new URL(req.url)
      const userIdParam = parseInt(searchParams.get('userId') || '', 10)

      if (isNaN(userIdParam) || userId !== userIdParam) {
         return NextResponse.json({ error: 'Access denied for this user' }, { status: 403 })
      }

      const addresses = await prisma.address.findMany({ where: { userId } })
      return NextResponse.json({ success: true, addresses }, { status: 200 })
   } catch (error) {
      console.error('❌ Błąd w GET /api/addresses:', error)
      return handleError(error)
   }
}

export async function POST(req: Request) {
   try {
      const userId = await getUserId()
      if (!userId) return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 })

      const body = await req.json()
      validateAddressData(body)

      if (body.isMain) {
         await prisma.address.updateMany({ where: { userId, isMain: true }, data: { isMain: false } })
      }

      const newAddress = await prisma.address.create({
         data: {
            userId,
            country: body.country,
            province: body.province,
            city: body.city,
            postalCode: body.postalCode,
            addressLine: body.addressLine,
            isMain: body.isMain,
         },
      })

      return NextResponse.json({ success: true, address: newAddress }, { status: 201 })
   } catch (error) {
      console.error('❌ Błąd w POST /api/addresses:', error)
      return handleError(error)
   }
}

export async function PUT(req: Request) {
   try {
      const userId = await getUserId()
      if (!userId) return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 })

      const { searchParams } = new URL(req.url)
      const addressId = parseInt(searchParams.get('id') || '', 10)

      if (isNaN(addressId)) {
         return NextResponse.json({ error: 'Invalid address ID' }, { status: 400 })
      }

      const address = await prisma.address.findUnique({ where: { id: addressId } })
      if (!address || address.userId !== userId) {
         return NextResponse.json({ error: 'Access denied or address not found' }, { status: 403 })
      }

      const body = await req.json()
      validateAddressData(body)

      if (body.isMain) {
         await prisma.address.updateMany({
            where: { userId, isMain: true, id: { not: addressId } },
            data: { isMain: false },
         })
      }

      const updatedAddress = await prisma.address.update({ where: { id: addressId }, data: body })
      return NextResponse.json({ success: true, address: updatedAddress }, { status: 200 })
   } catch (error) {
      console.error('❌ Błąd w PUT /api/addresses:', error)
      return handleError(error)
   }
}

export async function DELETE(req: Request) {
   try {
      const userId = await getUserId()
      if (!userId) return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 })

      const { searchParams } = new URL(req.url)
      const addressId = parseInt(searchParams.get('id') || '', 10)

      if (isNaN(addressId)) {
         return NextResponse.json({ error: 'Invalid address ID' }, { status: 400 })
      }

      const address = await prisma.address.findUnique({ where: { id: addressId } })
      if (!address || address.userId !== userId) {
         return NextResponse.json({ error: 'Access denied or address not found' }, { status: 403 })
      }

      await prisma.address.delete({ where: { id: addressId } })
      return NextResponse.json({ success: true, message: 'Address deleted successfully' }, { status: 200 })
   } catch (error) {
      console.error('❌ Błąd w DELETE /api/addresses:', error)
      return handleError(error)
   }
}
