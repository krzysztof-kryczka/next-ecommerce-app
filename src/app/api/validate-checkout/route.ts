import { NextResponse } from 'next/server'
import { Item } from '@/types/Item'
import { getUserId, handleError } from '@/lib/helpers'
import prisma from '@/lib/prisma'

export async function POST(req: Request) {
   try {
      const userId = await getUserId()
      if (!userId) return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 })

      const { items } = await req.json()

      const cart = await prisma.cart.findFirst({
         where: { userId },
         include: {
            items: {
               include: {
                  product: {
                     select: {
                        id: true,
                        name: true,
                        price: true,
                        imageUrl: true,
                        category: { select: { name: true } },
                     },
                  },
                  variant: {
                     select: {
                        id: true,
                        stock: true,
                        color: true,
                     },
                  },
               },
            },
         },
      })

      if (!cart) {
         return NextResponse.json({ error: '🚫 Cart not found' }, { status: 400 })
      }

      const validatedItems = items.map((item: Item) => {
         const cartItem = cart.items.find(ci => ci.productId === item.id)

         if (!cartItem) {
            throw new Error(`⚠️ Product with ID ${item.id} not found in cart`)
         }

         if (cartItem.product.price !== item.price) {
            throw new Error(`💰 Price mismatch for product ID ${item.id}`)
         }

         if (!cartItem.variant || cartItem.variant.stock < item.quantity) {
            throw new Error(`⚠️ Insufficient stock for product ID ${item.id}`)
         }

         return {
            id: cartItem.product.id,
            variantId: cartItem.variant.id,
            name: cartItem.product.name,
            price: cartItem.product.price,
            quantity: item.quantity,
            stock: cartItem.variant?.stock,
            imageUrl: cartItem.product.imageUrl[0],
            categoryName: cartItem.product.category.name,
         }
      })

      return NextResponse.json({ success: true, validatedItems }, { status: 200 })
   } catch (error) {
      return handleError(error)
   }
}
