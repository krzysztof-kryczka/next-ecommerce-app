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
export const validateAddressData = (body: any): void => {
   const requiredFields = ['country', 'province', 'city', 'postalCode', 'addressLine']
   const missingFields = requiredFields.filter(field => !body[field])

   if (missingFields.length > 0) {
      throw new Error(`Missing required fields: ${missingFields.join(', ')}`)
   }
}
