import type { NextApiResponse } from 'next'
import type { User } from '../types/User'
import type { Product } from '../types/Product'

export const sendResponse = (
   res: NextApiResponse,
   statusCode: number,
   success: boolean,
   message: string,
   data?: User | Product | Product[] | null
) => {
   res.status(statusCode).json({
      success,
      message,
      data,
   })
}
