import React, { JSX, useCallback } from 'react'
import PlusIcon from './icons/PlusIcon'
import MinusIcon from './icons/MinusIcon'
import Text from '@/components/ui/text'
import { QuantityPickerProps } from '@/types/QuantityPickerProps'

const QuantityPicker = ({
   quantity,
   setQuantity,
   stock,
   showTitle = true,
   size = 'lg',
   hideStock = false,
}: QuantityPickerProps): JSX.Element => {
   const sizes = {
      md: {
         button: 'h-5 w-5',
         container: 'px-[25px] py-3 w-[132px] h-[44px]',
         text: 'text-[14px]',
      },
      lg: {
         button: 'h-6 w-6',
         container: 'px-6 py-[15px] w-[142px] h-[54px]',
         text: 'text-lg',
      },
   }

   const decreaseQuantity = useCallback(() => {
      if (quantity > 1) setQuantity(quantity - 1)
   }, [quantity, setQuantity])

   const increaseQuantity = useCallback(() => {
      if (quantity < stock) setQuantity(quantity + 1)
   }, [quantity, stock, setQuantity])

   return (
      <div className='flex flex-col'>
         {showTitle && (
            <h4 className={`pb-3.5 ${sizes[size].text} font-medium text-[var(--color-neutral-300)]`}>Quantity:</h4>
         )}
         <div className='flex items-center gap-x-4'>
            <div
               className={`flex items-center gap-x-3.5 rounded-md border border-[var(--color-neutral-900)] ${
                  sizes[size].container
               }`}
            >
               <div
                  onClick={quantity > 1 ? decreaseQuantity : undefined}
                  className={`flex items-center justify-center ${sizes[size].button} ${
                     quantity <= 1 ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'
                  }`}
                  aria-disabled={quantity <= 1}
               >
                  <MinusIcon />
               </div>
               <span className={`${sizes[size].text} font-medium text-[var(--color-neutral-900)]`}>{quantity}</span>
               <div
                  onClick={quantity < stock ? increaseQuantity : undefined}
                  className={`flex items-center justify-center ${sizes[size].button} ${
                     quantity >= stock ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'
                  }`}
                  aria-disabled={quantity >= stock}
               >
                  <PlusIcon />
               </div>
            </div>
            {!hideStock && (
               <span className={`${sizes[size].text} font-medium text-[var(--color-neutral-900)]`}>Stock: {stock}</span>
            )}
         </div>
         {quantity >= stock && (
            <Text as='p' variant='textSmedium' className='pt-2 text-[var(--color-danger-50)]'>
               Maximum available stock reached.
            </Text>
         )}
      </div>
   )
}

export default QuantityPicker
