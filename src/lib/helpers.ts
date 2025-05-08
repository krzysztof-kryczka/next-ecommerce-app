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
