'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Image from 'next/image'

const RegistrationSuccess = () => {
   const router = useRouter()
   const [isAuthorized, setIsAuthorized] = useState(false)
   const [isLoading, setIsLoading] = useState(true)
   const [remainingTime, setRemainingTime] = useState<number | null>(null)

   useEffect(() => {
      const registeredData = sessionStorage.getItem('registered')
      if (registeredData) {
         const { expiresAt } = JSON.parse(registeredData)
         const currentTime = new Date().getTime()

         if (currentTime < expiresAt) {
            // Flaga istnieje i jest ważna
            setIsAuthorized(true)
            setRemainingTime(Math.floor((expiresAt - currentTime) / 1000)) // Ustaw początkowy czas pozostały
         } else {
            console.log('Flaga wygasła.')
            sessionStorage.removeItem('registered')
            router.push('/')
         }
      } else {
         router.push('/')
      }
      setIsLoading(false)
   }, [router])

   useEffect(() => {
      if (remainingTime !== null) {
         const intervalId = setInterval(() => {
            setRemainingTime(prev => {
               if (prev !== null && prev > 0) {
                  return prev - 1 // Zmniejszaj czas pozostały co sekundę
               } else {
                  // Gdy czas się skończy, przekieruj użytkownika
                  console.log('Flaga wygasła, przekierowanie na stronę główną.')
                  sessionStorage.removeItem('registered')
                  setIsAuthorized(false)
                  clearInterval(intervalId)
                  router.push('/')
                  return null
               }
            })
         }, 1000) // Aktualizacja co sekundę

         return () => clearInterval(intervalId) // Czyszczenie interwału przy odmontowaniu
      }
   }, [remainingTime, router])

   if (isLoading) {
      // Zablokuj renderowanie, dopóki flaga nie zostanie sprawdzona
      return null
   }

   if (!isAuthorized) {
      return null // Nic nie renderuj po wygaśnięciu autoryzacji
   }

   return (
      <div className='my-20 flex items-center justify-center bg-[var(--color-background)] text-white'>
         <div className='text-center'>
            <div className='mb-10 flex items-center justify-center'>
               <Image src='/check-circle.svg' alt='Success Icon' width={100} height={100} />
            </div>
            <h2 className='text-[44px] font-bold text-[var(--color-base-white2)]'>Thank you!</h2>
            <p className='pt-4 pb-8 text-2xl font-medium text-[var(--color-base-white2)]'>
               You have successfully register.
            </p>
            <p className='pb-[19px] text-lg'>
               Please check your e-mail for further information. Let’s exploring our products and enjoy many gifts.
            </p>
            <p className='text-lg'>
               Having problems?{' '}
               <a href='/contact' className='text-[var(--color-primary-400)] hover:underline'>
                  Contact us
               </a>
            </p>
         </div>
         {remainingTime !== null && (
            <p className='mt-4 text-lg'>
               Ta strona zniknie za: <span className='font-bold'>{remainingTime} sekund</span>
            </p>
         )}
      </div>
   )
}

export default RegistrationSuccess
