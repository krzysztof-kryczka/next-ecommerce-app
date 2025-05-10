import React, { JSX } from 'react'
import Text from '@/components/ui/text'
import { useCurrency } from '@/context/CurrencyContext'

const Subtotal = ({ quantity, price }: { quantity: number; price: number }): JSX.Element => {
   const { currency, convertCurrency, currencySymbols } = useCurrency()
   return (
      <div className='flex items-center justify-between'>
         <Text as='p' variant='textLmedium' className='text-[var(--color-neutral-300))]'>
            Subtotal:
         </Text>
         <Text as='p' variant='h5medium' className='text-[var(--color-neutral-900)]'>
            {currencySymbols[currency] || currency} {convertCurrency((quantity * price).toString(), 'USD', currency)}
         </Text>
      </div>
   )
}

export default Subtotal
