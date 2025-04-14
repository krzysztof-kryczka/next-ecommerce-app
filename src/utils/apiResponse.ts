import type { NextApiResponse } from 'next'
import type { User } from '../types/User'

export const sendResponse = (
   res: NextApiResponse,
   statusCode: number,
   success: boolean,
   message: string,
   data?: User | null,
) => {
   res.status(statusCode).json({
      success,
      message,
      data,
   })
}
