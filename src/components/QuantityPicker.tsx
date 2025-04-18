import React from 'react'
import PlusIcon from './icons/PlusIcon'
import MinusIcon from './icons/MinusIcon'

const QuantityPicker = ({
   quantity,
   setQuantity,
   stock,
}: {
   quantity: number
   setQuantity: React.Dispatch<React.SetStateAction<number>>
   stock: number
}) => {
   const decreaseQuantity = () => {
      if (quantity > 1) setQuantity(quantity - 1)
   }

   const increaseQuantity = () => {
      if (quantity < stock) setQuantity(quantity + 1)
   }

   return (
      <div className='flex flex-col'>
         <h4 className='pb-4 text-lg font-medium text-[var(--color-neutral-300)]'>Quantity:</h4>
         <div className='flex items-center gap-x-4'>
            <div className='flex items-center gap-x-3.5 rounded-md border border-[var(--color-neutral-900)] px-6 py-[15px]'>
               <div onClick={decreaseQuantity} className='flex h-10 w-10 cursor-pointer items-center justify-center'>
                  <MinusIcon />
               </div>
               <span className='text-base font-medium text-[var(--color-neutral-900)]'>{quantity}</span>
               <div onClick={increaseQuantity} className='flex h-10 w-10 cursor-pointer items-center justify-center'>
                  <PlusIcon />
               </div>
            </div>
            <span className='text-base font-medium text-[var(--color-neutral-900)]'>Stock: {stock}</span>
         </div>
      </div>
   )
}

export default QuantityPicker
