import React from 'react'
import Text from '@/components/ui/text'

const Subtotal = ({ quantity, price }: { quantity: number; price: number }) => {
   return (
      <div className='flex items-center justify-between'>
         <Text as='p' variant='textLmedium' className='text-[var(--color-neutral-300))]'>
            Subtotal:
         </Text>
         <Text as='p' variant='h5medium' className='text-[var(--color-neutral-900))]'>
            ${(quantity * price).toFixed(2)}
         </Text>
      </div>
   )
}

export default Subtotal
