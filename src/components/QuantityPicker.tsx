import React from 'react'
import PlusIcon from './icons/PlusIcon'
import MinusIcon from './icons/MinusIcon'

const QuantityPicker = ({
   quantity,
   setQuantity,
   stock,
   showTitle = true,
   size = 'lg',
   hideStock = false,
}: {
   quantity: number
   setQuantity: React.Dispatch<React.SetStateAction<number>>
   stock: number
   showTitle?: boolean
   size?: 'md' | 'lg'
   hideStock?: boolean
}) => {
   const sizes = {
      md: {
         button: 'h-5 w-5',
         container: 'px-[25px] py-3',
         text: 'text-[14px]',
      },
      lg: {
         button: 'h-6 w-6',
         container: 'px-6 py-[15px]',
         text: 'text-lg',
      },
   }
   const decreaseQuantity = () => {
      if (quantity > 1) setQuantity(quantity - 1)
   }

   const increaseQuantity = () => {
      if (quantity < stock) setQuantity(quantity + 1)
   }

   return (
      <div className='flex flex-col'>
         {showTitle && (
            <h4 className={`pb-4 ${sizes[size].text} font-medium text-[var(--color-neutral-300)]`}>Quantity:</h4>
         )}
         <div className='flex items-center gap-x-4'>
            <div
               className={`flex items-center gap-x-3.5 rounded-md border border-[var(--color-neutral-900)] ${
                  sizes[size].container
               }`}
            >
               <div
                  onClick={decreaseQuantity}
                  className={`flex cursor-pointer items-center justify-center ${sizes[size].button}`}
               >
                  <MinusIcon />
               </div>
               <span className={`${sizes[size].text} font-medium text-[var(--color-neutral-900)]`}>{quantity}</span>
               <div
                  onClick={increaseQuantity}
                  className={`flex cursor-pointer items-center justify-center ${sizes[size].button} ${
                     quantity >= stock ? 'cursor-not-allowed opacity-50' : ''
                  }`}
                  disabled={quantity >= stock}
               >
                  <PlusIcon />
               </div>
            </div>
            {!hideStock && (
               <span className={`${sizes[size].text} font-medium text-[var(--color-neutral-900)]`}>Stock: {stock}</span>
            )}
         </div>
         {quantity >= stock && (
            <p className='pt-2 text-sm text-[var(--color-blazeOrange-600)]'>Maximum available stock reached.</p>
         )}
      </div>
   )
}

export default QuantityPicker
