import { DecodedToken } from '@/types/DecodedToken'
import jwt from 'jsonwebtoken'

export const verifyToken = (token: string): DecodedToken | null => {
   try {
      const secretKey = process.env.JWT_SECRET
      if (!secretKey) {
         throw new Error('Missing JWT_SECRET environment variable.')
      }
      // console.log('Token to Verify:', token)
      const decoded = jwt.verify(token, secretKey) as DecodedToken
      // console.log('Decoded Token:', decoded)
      return decoded
   } catch (err: unknown) {
      if (err instanceof Error) {
         console.error('Token verification failed:', err.message)
      } else {
         console.error('Unknown error occurred during token verification.')
      }
      return null // DecodedToken | null
   }
}
