import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import prisma from '@/lib/prisma'

export async function GET() {
   const session = await getServerSession(authOptions)
   if (!session?.user) {
      return NextResponse.json({ success: false, message: 'Unauthorized: No session found' }, { status: 401 })
   }
   const userId = parseInt(session.user.id, 10)

   const cart = await prisma.cart.findFirst({
      where: { userId },
      include: {
         items: {
            include: {
               product: {
                  include: {
                     category: true,
                  },
               },
            },
         },
      },
   })

   const formattedCart = cart
      ? {
           ...cart,
           items: cart.items.map(item => ({
              id: item.product.id,
              name: item.product.name,
              price: item.product.price,
              quantity: item.quantity,
              stock: item.product.stock,
              imageUrl: item.product.imageUrl?.[0],
              categoryName: item.product.category?.name,
           })),
        }
      : { items: [] }

   return NextResponse.json(formattedCart, { status: 200 })
}

export async function POST(req: Request) {
   const session = await getServerSession(authOptions)
   if (!session?.user) {
      return NextResponse.json({ success: false, message: 'Unauthorized: No session found' }, { status: 401 })
   }
   const userId = parseInt(session.user.id, 10)

   const { productId, quantity } = await req.json()

   let cart = await prisma.cart.findFirst({ where: { userId } })
   if (!cart) {
      cart = await prisma.cart.create({ data: { userId } })
   }

   const existingItem = await prisma.cartItem.findFirst({ where: { cartId: cart.id, productId } })
   if (existingItem) {
      await prisma.cartItem.update({
         where: { id: existingItem.id },
         data: { quantity: existingItem.quantity + quantity },
      })
   } else {
      await prisma.cartItem.create({ data: { cartId: cart.id, productId, quantity } })
   }

   const updatedCart = await prisma.cart.findFirst({
      where: { userId },
      include: { items: { include: { product: true } } },
   })

   return NextResponse.json(updatedCart, { status: 201 })
}

export async function PATCH(req: Request) {
   const session = await getServerSession(authOptions)
   if (!session?.user) {
      return NextResponse.json({ success: false, message: 'Unauthorized: No session found' }, { status: 401 })
   }
   const userId = parseInt(session.user.id, 10)

   const { productId, quantity } = await req.json()

   const cart = await prisma.cart.findFirst({ where: { userId } })
   if (!cart) {
      return NextResponse.json({ error: 'Cart not found' }, { status: 404 })
   }

   const existingItem = await prisma.cartItem.findFirst({ where: { cartId: cart.id, productId } })
   if (!existingItem) {
      return NextResponse.json({ error: 'Item not found in cart' }, { status: 404 })
   }

   await prisma.cartItem.update({ where: { id: existingItem.id }, data: { quantity: Math.max(1, quantity) } })

   const updatedCart = await prisma.cart.findFirst({
      where: { userId },
      include: { items: { include: { product: true } } },
   })

   return NextResponse.json(updatedCart, { status: 200 })
}

export async function DELETE(req: Request) {
   const session = await getServerSession(authOptions)
   if (!session?.user) {
      return NextResponse.json({ success: false, message: 'Unauthorized: No session found' }, { status: 401 })
   }
   const userId = parseInt(session.user.id, 10)

   const { productId } = await req.json()

   const cart = await prisma.cart.findFirst({ where: { userId } })
   if (!cart) {
      return NextResponse.json({ error: 'Cart not found' }, { status: 404 })
   }

   const existingItem = await prisma.cartItem.findFirst({ where: { cartId: cart.id, productId } })
   if (!existingItem) {
      return NextResponse.json({ error: 'Item not found in cart' }, { status: 404 })
   }

   await prisma.cartItem.delete({ where: { id: existingItem.id } })

   const updatedCart = await prisma.cart.findFirst({
      where: { userId },
      include: { items: { include: { product: true } } },
   })

   return NextResponse.json(updatedCart, { status: 200 })
}
