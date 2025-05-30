import { NextResponse } from 'next/server'
import { getUserId } from '@/lib/helpers'
import prisma from '@/lib/prisma'

export async function GET() {
   const userId = await getUserId()
   if (!userId) return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 })

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
               variant: true,
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
              stock: item.variant?.stock,
              color: item.variant?.color,
              variantId: item.variant?.id,
              imageUrl: item.product.imageUrl?.[0],
              categoryName: item.product.category?.name,
           })),
        }
      : { items: [] }

   return NextResponse.json(formattedCart, { status: 200 })
}

export async function POST(req: Request) {
   const userId = await getUserId()
   if (!userId) return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 })

   const { productId, quantity, variantId } = await req.json() // ✅ Pobieramy `variantId`!

   if (!variantId) {
      return NextResponse.json({ success: false, message: 'Variant ID is required' }, { status: 400 })
   }

   let cart = await prisma.cart.findFirst({ where: { userId } })
   if (!cart) {
      cart = await prisma.cart.create({ data: { userId } })
   }

   const existingProduct = await prisma.cartItem.findFirst({ where: { cartId: cart.id, productId } })

   if (existingProduct) {
      return NextResponse.json({ error: 'This product is already in the cart' }, { status: 400 })
   }

   const existingItem = await prisma.cartItem.findFirst({ where: { cartId: cart.id, productId, variantId } }) // ✅ Sprawdzamy, czy istnieje ten `variantId`
   if (existingItem) {
      await prisma.cartItem.update({
         where: { id: existingItem.id },
         data: { quantity: existingItem.quantity + quantity },
      })
   } else {
      await prisma.cartItem.create({ data: { cartId: cart.id, productId, variantId, quantity } }) // ✅ Zapisywanie `variantId`
   }

   const updatedCart = await prisma.cart.findFirst({
      where: { userId },
      include: { items: { include: { product: true, variant: true } } }, // ✅ Pobieramy `variant` poprawnie!
   })

   return NextResponse.json(updatedCart, { status: 201 })
}

export async function PATCH(req: Request) {
   const userId = await getUserId()
   if (!userId) return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 })

   const { productId, quantity } = await req.json()

   const cart = await prisma.cart.findFirst({ where: { userId } })
   if (!cart) {
      return NextResponse.json({ error: 'Cart not found' }, { status: 404 })
   }

   const existingItem = await prisma.cartItem.findFirst({ where: { cartId: cart.id, productId } })
   if (!existingItem) {
      return NextResponse.json({ error: 'Item not found in cart' }, { status: 404 })
   }

   // 🛠️ Aktualizacja ilości produktu, ale zachowujemy `variantId`
   await prisma.cartItem.update({
      where: { id: existingItem.id },
      data: { quantity: Math.max(1, quantity) },
   })

   const updatedCart = await prisma.cart.findFirst({
      where: { userId },
      include: { items: { include: { product: true, variant: true } } }, // ✅ Pobieramy poprawne `variantId`
   })

   return NextResponse.json(updatedCart, { status: 200 })
}

export async function DELETE(req: Request) {
   const userId = await getUserId()
   if (!userId) return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 })

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
