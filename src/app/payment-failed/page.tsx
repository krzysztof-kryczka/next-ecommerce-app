'use client'

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { useRouter } from 'next/navigation'
import React from 'react'

const PaymentFailedPage = () => {
   const router = useRouter()
   return (
      <div className='mx-auto flex max-w-[1440px] flex-col gap-y-8 px-4 pb-10 sm:px-6 md:px-10'>
         <Card className='rounded-md border border-[var(--color-gray-800)] bg-[var(--color-base-gray)] p-6'>
            <h1>Payment Failed</h1>
            <p>
               Unfortunately, your payment could not be processed. Please try again or contact support if the problem
               persists.
            </p>
            <Button variant='fill' className='' onClick={() => router.push('/products')}>
               Try Again
            </Button>
         </Card>
      </div>
   )
}

export default PaymentFailedPage
