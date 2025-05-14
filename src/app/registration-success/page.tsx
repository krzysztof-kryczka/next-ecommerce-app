'use client'

import { useRouter } from 'next/navigation'
import { startTransition, useEffect, useState } from 'react'
import CheckCircleIcon from '@/components/icons/CheckCircleIcon'

const RegistrationSuccess = () => {
   const router = useRouter()
   const [isAuthorized, setIsAuthorized] = useState(false)
   const [isLoading, setIsLoading] = useState(true)
   const [remainingTime, setRemainingTime] = useState<number | null>(null)

   useEffect(() => {
      const registeredData = sessionStorage.getItem('registered')
      // console.log('SessionStorage on RegistrationSuccess:', registeredData)

      if (registeredData) {
         const { expiresAt } = JSON.parse(registeredData)
         const currentTime = new Date().getTime()

         if (currentTime < expiresAt) {
            setIsAuthorized(true)
            setRemainingTime(Math.floor((expiresAt - currentTime) / 1000))
         } else {
            // console.log('Flaga registered wygasła. Usuwam sesję i przekierowuję na stronę główną.')
            sessionStorage.removeItem('registered')
            router.push('/')
         }
      } else {
         // console.log('Brak sesji, przekierowanie na stronę główną.')
         router.push('/')
      }
      setIsLoading(false)
   }, [router])

   /// BUGS:
   // Aktualizujemy remainingTime co sekundę, ale za każdym razem, gdy wartość się zmienia, powoduje ponowne renderowanie. 
   // Problem prawdopodobnie rozwiązuje useRef ale jak zastosować do Setinterwału ???

   useEffect(() => {
      if (remainingTime !== null && remainingTime > 0) {
         const intervalId = setInterval(() => {
            setRemainingTime(prev => {
               if (prev !== null && prev > 1) {
                  return prev - 1
               } else {
                  // console.log('Sesja wygasła – przekierowanie na stronę główną.')
                  sessionStorage.removeItem('registered')
                  setIsAuthorized(false)
                  clearInterval(intervalId)
                  // startTransition, aby uniknąć błędu React
                  startTransition(() => {
                     router.push('/')
                  })

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
               <CheckCircleIcon />
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
               This page will disappear in: <span className='font-bold'>{remainingTime} seconds</span>
            </p>
         )}
      </div>
   )
}

export default RegistrationSuccess
