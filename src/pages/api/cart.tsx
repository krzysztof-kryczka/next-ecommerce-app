import { PrismaClient } from '../../generated/prisma'
import { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth'
import { authOptions } from './auth/[...nextauth]'
import { sendResponse } from '@/utils/apiResponse'

const prisma = new PrismaClient()

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
   const session = await getServerSession(req, res, authOptions)

   if (!session || !session.user) {
      return res.status(401).json({
         success: false,
         message: 'Unauthorized: User not authenticated',
      })
   }

   const userId = parseInt(session.user.id, 10)

   if (req.method === 'GET') {
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

      if (cart) {
         cart.items = cart.items.map(item => ({
            id: item.product.id,
            name: item.product.name,
            price: item.product.price,
            quantity: item.quantity,
            stock: item.product.stock,
            imageUrl: item.product.imageUrl?.[0],
            categoryName: item.product.category?.name || 'Unknown', // Dodanie nazwy kategorii
         }))
      }

      return res.status(200).json(cart || { items: [] })
   }

   if (req.method === 'POST') {
      try {
         const { productId, quantity } = req.body

         let cart = await prisma.cart.findFirst({
            where: { userId },
         })

         if (!cart) {
            cart = await prisma.cart.create({
               data: { userId },
            })
         }

         const existingItem = await prisma.cartItem.findFirst({
            where: { cartId: cart.id, productId },
         })

         if (existingItem) {
            await prisma.cartItem.update({
               where: { id: existingItem.id },
               data: { quantity: existingItem.quantity + quantity },
            })
         } else {
            await prisma.cartItem.create({
               data: {
                  cartId: cart.id,
                  productId,
                  quantity,
               },
            })
         }

         const updatedCart = await prisma.cart.findFirst({
            where: { userId },
            include: {
               items: {
                  include: {
                     product: true,
                  },
               },
            },
         })

         return res.status(201).json(updatedCart)
      } catch (error) {
         console.error('Error adding to cart:', error)
         return sendResponse(res, 500, false, 'Failed to add item to cart')
      }
   }

   if (req.method === 'PATCH') {
      try {
         const { productId, quantity } = req.body

         const cart = await prisma.cart.findFirst({
            where: { userId },
         })

         if (!cart) {
            return res.status(404).json({ error: 'Cart not found' })
         }

         const existingItem = await prisma.cartItem.findFirst({
            where: { cartId: cart.id, productId },
         })

         if (!existingItem) {
            return sendResponse(res, 404, false, 'Item not found in cart')
         }

         await prisma.cartItem.update({
            where: { id: existingItem.id },
            data: { quantity: Math.max(1, quantity) },
         })

         const updatedCart = await prisma.cart.findFirst({
            where: { userId },
            include: {
               items: {
                  include: {
                     product: true,
                  },
               },
            },
         })

         return res.status(200).json(updatedCart)
      } catch (error) {
         console.error('Error updating cart item:', error)
         return sendResponse(res, 500, false, 'Failed to update cart item')
      }
   }

   if (req.method === 'DELETE') {
      try {
         const { productId } = req.body

         const cart = await prisma.cart.findFirst({
            where: { userId },
         })

         if (!cart) {
            return sendResponse(res, 404, false, 'Cart not found')
         }

         const existingItem = await prisma.cartItem.findFirst({
            where: { cartId: cart.id, productId },
         })

         if (!existingItem) {
            return sendResponse(res, 404, false, 'Item not found in cart')
         }

         await prisma.cartItem.delete({
            where: { id: existingItem.id },
         })

         const updatedCart = await prisma.cart.findFirst({
            where: { userId },
            include: {
               items: {
                  include: {
                     product: true,
                  },
               },
            },
         })

         return res.status(200).json(updatedCart)
      } catch (error) {
         console.error('Error deleting cart item:', error)
         return sendResponse(res, 500, false, 'Failed to delete cart item')
      }
   }

   return res.setHeader('Allow', ['GET', 'POST', 'PATCH', 'DELETE']).status(405).end(`Method ${req.method} Not Allowed`)
}
