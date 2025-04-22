import { verifyToken } from '@/lib/verifyToken'
import prisma from '@/lib/prisma'
import { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
   const secretKey = process.env.JWT_SECRET
   if (!secretKey) {
      console.error('Missing JWT_SECRET environment variable')
      return res.status(500).json({ error: 'Server configuration error' })
   }

   const authHeader = req.headers.authorization

   if (!authHeader) {
      return res.status(401).json({ error: 'Authorization header is missing' })
   }
   if (!authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Authorization header format is invalid' })
   }

   const token = authHeader.split(' ')[1]
   if (process.env.NODE_ENV === 'development') {
      console.log('Authorization Header Token:', token)
   }

   const decoded = verifyToken(token)
   if (!decoded) {
      return res.status(401).json({ error: 'Invalid token' })
   }
   if (process.env.NODE_ENV === 'development') {
      console.log('Decoded Token from verifyToken:', decoded)
   }

   // Walidacja
   const userId = decoded.id
   const userIdParam = parseInt(req.query.userId as string, 10)
   if (isNaN(userIdParam)) {
      return res.status(400).json({ error: 'Invalid userId parameter' })
   }
   if (userId !== userIdParam) {
      return res.status(403).json({ error: 'Access denied for this user' })
   }

   try {
      if (req.method === 'GET') {
         const addresses = await prisma.address.findMany({
            where: { userId },
         })

         return res.status(200).json({ success: true, addresses })
      }

      if (req.method === 'POST') {
         const { country, province, city, postalCode, addressLine, isMain } = req.body

         if (!country || !province || !city || !postalCode || !addressLine) {
            return res.status(400).json({ error: 'Missing required fields' })
         }

         if (isMain) {
            await prisma.address.updateMany({
               where: {
                  userId,
                  isMain: true,
               },
               data: {
                  isMain: false,
               },
            })
         }

         const newAddress = await prisma.address.create({
            data: {
               userId,
               country,
               province,
               city,
               postalCode,
               addressLine,
               isMain: isMain || false,
            },
         })

         return res.status(201).json({ success: true, address: newAddress })
      }

      if (req.method === 'OPTIONS') {
         res.setHeader('Allow', 'GET, POST')
         return res.status(204).end()
      }

      return res.status(405).json({ error: 'Method not allowed' })
   } catch (error) {
      console.error('Server Error:', error)
      return res.status(500).json({ error: 'Internal Server Error' })
   }
}
