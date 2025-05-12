import { Address } from '@/types/Address'
import { authOptions } from '@/utils/authOptions'
import { getServerSession } from 'next-auth'
import { NextResponse } from 'next/server'

/**
 * Obsługuje błędy i zwraca czytelne komunikaty JSON.
 *
 * @param {unknown} error - Błąd do obsłużenia.
 * @returns {NextResponse} - Odpowiedź JSON z komunikatem błędu.
 */
export const handleError = (error: unknown): NextResponse => {
   return NextResponse.json(
      {
         error: error instanceof Error ? error.message : 'Unknown error occurred',
      },
      { status: 500 },
   )
}

/**
 * Sprawdza, czy wszystkie wymagane pola adresu zostały przekazane.
 *
 * @param {any} body - Obiekt zawierający dane adresowe.
 * @throws {Error} - Jeśli brakuje wymaganych pól.
 */
export const validateAddressData = (body: Partial<Address>): void => {
   const requiredFields: (keyof Address)[] = ['country', 'province', 'city', 'postalCode', 'addressLine']
   const missingFields = requiredFields.filter(field => !body[field])

   if (missingFields.length > 0) {
      throw new Error(`Missing required fields: ${missingFields.join(', ')}`)
   }
}

/**
 * Formatuje datę ISO na format YYYY-MM-DD HH:mm
 *
 * @param {string} isoDate - Data w formacie ISO
 * @returns {string} - Sformatowana data w formacie YYYY-MM-DD HH:mm
 */
export const formatDate = (isoDate: string): string => {
   const date = new Date(isoDate)
   return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`
}

/**
 * Maskuje numer telefonu, zastępując wszystkie znaki oprócz ostatnich dwóch gwiazdkami.
 *
 * @param {string} phone - Numer telefonu do zamaskowania.
 * @returns {string} - Zamaskowany numer w postaci "****56".
 */
export const maskPhoneNumber = (phone: string): string => {
   return phone.replace(/.(?=.{2})/g, '∗')
}

/**
 * Pobiera ID użytkownika z sesji NextAuth.
 *
 * @returns {number | null} - ID użytkownika jako liczba lub null, jeśli sesja nie istnieje.
 */
export const getUserId = async () => {
   const session = await getServerSession(authOptions)
   if (!session?.user) return null
   return parseInt(session.user.id, 10) || null
}
