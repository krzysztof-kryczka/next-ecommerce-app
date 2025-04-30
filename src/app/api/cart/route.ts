import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '../../../pages/api/auth/[...nextauth]'

export async function GET(req: Request) {
   const session = await getServerSession(authOptions)
   if (!session?.user?.id) {
      console.log('🚨 Unauthorized access attempt')
      return NextResponse.json({ success: false, message: 'Unauthorized: User not authenticated' }, { status: 401 })
   }

   const userId = parseInt(session.user.id, 10)
   console.log(`✅ Fetching cart for user ID: ${userId}`)

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

   console.log(`🛒 Cart fetched: ${cart}`)

   if (cart) {
      cart.items = cart.items.map(item => ({
         id: item.product.id,
         name: item.product.name,
         price: item.product.price,
         quantity: item.quantity,
         stock: item.product.stock,
         imageUrl: item.product.imageUrl?.[0],
         categoryName: item.product.category?.name || 'Unknown',
      }))
   }

   return NextResponse.json(cart || { items: [] }, { status: 200 })
}

export async function POST(req: Request) {
   console.log('📌 Received POST request to add item to cart')

   const session = await getServerSession(authOptions)
   if (!session?.user?.id) {
      console.log('🚨 Unauthorized access attempt')
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 })
   }

   const userId = parseInt(session.user.id, 10)
   const { productId, quantity } = await req.json()
   console.log(`✅ Adding product ID: ${productId}, Quantity: ${quantity} for user ID: ${userId}`)

   let cart = await prisma.cart.findFirst({ where: { userId } })
   if (!cart) {
      console.log('🛒 No existing cart found, creating new cart')
      cart = await prisma.cart.create({ data: { userId } })
   }

   const existingItem = await prisma.cartItem.findFirst({ where: { cartId: cart.id, productId } })
   if (existingItem) {
      console.log('🔄 Updating existing cart item quantity')
      await prisma.cartItem.update({
         where: { id: existingItem.id },
         data: { quantity: existingItem.quantity + quantity },
      })
   } else {
      console.log('✨ Adding new item to cart')
      await prisma.cartItem.create({ data: { cartId: cart.id, productId, quantity } })
   }

   const updatedCart = await prisma.cart.findFirst({
      where: { userId },
      include: { items: { include: { product: true } } },
   })
   console.log('✅ Cart updated:', updatedCart)

   return NextResponse.json(updatedCart, { status: 201 })
}

export async function PATCH(req: Request) {
   console.log('📌 Received PATCH request to update cart item quantity')

   const session = await getServerSession(authOptions)
   if (!session?.user?.id) {
      console.log('🚨 Unauthorized access attempt')
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 })
   }

   const userId = parseInt(session.user.id, 10)
   const { productId, quantity } = await req.json()
   console.log(`🔄 Updating quantity for product ID: ${productId}, New Quantity: ${quantity}`)

   const cart = await prisma.cart.findFirst({ where: { userId } })
   if (!cart) {
      console.log('🚨 Cart not found')
      return NextResponse.json({ error: 'Cart not found' }, { status: 404 })
   }

   const existingItem = await prisma.cartItem.findFirst({ where: { cartId: cart.id, productId } })
   if (!existingItem) {
      console.log('🚨 Item not found in cart')
      return NextResponse.json({ error: 'Item not found in cart' }, { status: 404 })
   }

   await prisma.cartItem.update({ where: { id: existingItem.id }, data: { quantity: Math.max(1, quantity) } })
   console.log('✅ Quantity updated')

   const updatedCart = await prisma.cart.findFirst({
      where: { userId },
      include: { items: { include: { product: true } } },
   })
   console.log('✅ Cart updated:', updatedCart)

   return NextResponse.json(updatedCart, { status: 200 })
}

export async function DELETE(req: Request) {
   console.log('📌 Received DELETE request to remove item from cart')

   const session = await getServerSession(authOptions)
   if (!session?.user?.id) {
      console.log('🚨 Unauthorized access attempt')
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 })
   }

   const userId = parseInt(session.user.id, 10)
   const { productId } = await req.json()
   console.log(`🗑️ Attempting to remove product ID: ${productId} from cart`)

   const cart = await prisma.cart.findFirst({ where: { userId } })
   if (!cart) {
      console.log('🚨 Cart not found')
      return NextResponse.json({ error: 'Cart not found' }, { status: 404 })
   }

   const existingItem = await prisma.cartItem.findFirst({ where: { cartId: cart.id, productId } })
   if (!existingItem) {
      console.log('🚨 Item not found in cart')
      return NextResponse.json({ error: 'Item not found in cart' }, { status: 404 })
   }

   await prisma.cartItem.delete({ where: { id: existingItem.id } })
   console.log('✅ Item removed successfully')

   const updatedCart = await prisma.cart.findFirst({
      where: { userId },
      include: { items: { include: { product: true } } },
   })
   console.log('✅ Updated cart:', updatedCart)

   return NextResponse.json(updatedCart, { status: 200 })
}
