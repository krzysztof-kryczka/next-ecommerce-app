import React from 'react'

const Subtotal = ({ quantity, price }: { quantity: number; price: number }) => {
   return (
      <div className='flex items-center justify-between'>
         <p className='text-lg font-medium text-[var(--color-neutral-300)]'>Subtotal:</p>
         <p className='text-[28px] font-medium text-[var(--color-neutral-900)]'>${(quantity * price).toFixed(2)}</p>
      </div>
   )
}

export default Subtotal
