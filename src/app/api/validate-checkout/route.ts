import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { Item } from '@/types/Item'

export async function POST(req: Request) {
   try {
      const { userId, items } = await req.json()

      console.log('User ID:', userId)
      console.log('Selected items from frontend:', items)

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
                        stock: true,
                        imageUrl: true,
                        category: { select: { name: true } },
                     },
                  },
               },
            },
         },
      })

      if (!cart) {
         console.error('❌ No cart found for user')
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

         if (cartItem.product.stock < item.quantity) {
            throw new Error(`⚠️ Insufficient stock for product ID ${item.id}`)
         }

         if (item.quantity > cartItem.quantity) {
            throw new Error(`⛔ Requested quantity exceeds cart quantity for product ID ${item.id}`)
         }

         return {
            id: cartItem.product.id,
            name: cartItem.product.name,
            price: cartItem.product.price,
            quantity: item.quantity,
            stock: cartItem.product.stock,
            imageUrl: cartItem.product.imageUrl[0],
            categoryName: cartItem.product.category.name,
         }
      })

      return NextResponse.json({ success: true, validatedItems }, { status: 200 })
   } catch (err) {
      if (err instanceof Error) {
         console.error('❌ Error during validation:', err.message)
         return NextResponse.json({ error: `🚨 Error during validation: ${err.message}` }, { status: 400 })
      } else {
         console.error('🚨 Unknown error occurred:', err)
         return NextResponse.json({ error: '🚨 Unknown error occurred' }, { status: 400 })
      }
   }
}
