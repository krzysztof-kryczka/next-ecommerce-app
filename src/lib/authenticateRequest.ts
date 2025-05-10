import { verifyToken } from '@/lib/verifyToken'

/**
 * 🔐 authenticateRequest(req)
 *
 * Pobiera token JWT z nagłówka Authorization w żądaniu req
 * - Sprawdza, czy nagłówek istnieje i zaczyna się od Bearer
 * - Pobiera token i weryfikuje go za pomocą verifyToken()
 * - Jeśli token jest poprawny, zwraca userId użytkownika 🙂
 * - Jeśli coś jest niepoprawne, rzuca błądem
 *
 * @param {Request} req - Obiekt żądania HTTP zawierający nagłówki autoryzacji.
 * @returns {number} - userId użytkownika uzyskany z tokena JWT.
 * @throws {Error} - Jeśli token jest niepoprawny lub brak autoryzacji.
 */
export const authenticateRequest = async (req: Request): Promise<number> => {
   try {
      const secretKey = process.env.JWT_SECRET
      if (!secretKey) {
         throw new Error('Server configuration error: Missing JWT_SECRET')
      }
      const authHeader = req.headers.get('Authorization')
      //console.log('🔍 Debug: Authorization Header:', authHeader)
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
         //console.error('🚫 Invalid Authorization Header')
         throw new Error('Invalid or missing authorization header')
      }

      const token = authHeader.split(' ')[1]
      const decoded = verifyToken(token)
      //console.log('🔍 Debug: Decoded Token:', decoded)
      if (!decoded) {
         //console.error('🚫 Invalid Token')
         throw new Error('Invalid token')
      }

      return Number(decoded.id)
   } catch (err) {
      if (err instanceof Error) {
         console.error('❌ Authentication Error:', err.message)
         throw new Error(`Authentication failed: ${err.message}`)
      } else {
         //console.error('🚨 Unknown error occurred:', err)
         throw new Error(`Unknown error occurred: ${err}`)
      }
   }
}
