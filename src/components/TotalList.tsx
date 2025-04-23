import { Separator } from '@/components/ui/separator'
import { CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

interface TotalListProps {
   items: {
      id: number
      name: string
      price: number
      quantity: number
   }[]
   selectedItems?: number[]
   onCheckout?: () => void
   showCheckoutButton?: boolean
   isCheckoutPage?: boolean
   productProtectionPrice?: number
   shippingPrice?: number
   shippingInsurancePrice?: number
   serviceFees?: number
}

const TotalList = ({
   items,
   selectedItems = [],
   onCheckout,
   showCheckoutButton = true,
   isCheckoutPage = false,
   productProtectionPrice = 0,
   shippingPrice = 0,
   shippingInsurancePrice = 0,
   serviceFees = 0,
}: TotalListProps) => {
   const filteredItems = selectedItems.length > 0 ? items.filter(item => selectedItems.includes(item.id)) : items

   const subtotal = filteredItems.reduce((total, item) => total + item.price * item.quantity, 0)
   const grandTotal =
      subtotal + (isCheckoutPage ? productProtectionPrice + shippingPrice + shippingInsurancePrice + serviceFees : 0)

   return (
      <CardContent className='px-0'>
         <div className='flex flex-col gap-y-4'>
            <div className='flex flex-col gap-y-2 text-base font-medium text-[var(--color-neutral-900)]'>
               {filteredItems.map(item => (
                  <div key={item.id} className='flex justify-between'>
                     <span>
                        {item.name} ({item.quantity} × ${item.price.toFixed(2)})
                     </span>
                     <span>${(item.quantity * item.price).toFixed(2)}</span>
                  </div>
               ))}
            </div>
         </div>

         {isCheckoutPage && (
            <div className='flex flex-col gap-y-4'>
               <div className='flex justify-between'>
                  <span className='text-base text-[var(--color-neutral-900)]'>Product Protection:</span>
                  <span>${productProtectionPrice.toFixed(2)}</span>
               </div>
               <div className='flex justify-between'>
                  <span className='text-base text-[var(--color-neutral-900)]'>Shipping Price:</span>
                  <span>${shippingPrice.toFixed(2)}</span>
               </div>
               <div className='flex justify-between'>
                  <span className='text-base text-[var(--color-neutral-900)]'>Shipping Insurance:</span>
                  <span>${shippingInsurancePrice.toFixed(2)}</span>
               </div>
               <div className='col-span-full my-6'>
                  <Separator className='bg-[var(--color-gray-800)]' />
               </div>
               <div className='flex flex-col justify-between'>
                  <p>Transaction Fees</p>
                  <p className='text-base text-[var(--color-neutral-900)]'>Service Fees:</p>
                  <span>${serviceFees.toFixed(2)}</span>
               </div>
            </div>
         )}

         <div className='col-span-full my-6'>
            <Separator className='bg-[var(--color-gray-800)]' />
         </div>
         <div className='align-center flex justify-between pb-6'>
            <p className='text-lg font-medium text-[var(--color-neutral-900)]'>Grand Total:</p>
            <p className='text-[28px] font-medium text-[var(--color-neutral-900)]'>${grandTotal.toFixed(2)}</p>
         </div>
         {showCheckoutButton && (
            <Button
               variant='fill'
               size='XXL'
               className='w-full bg-[var(--color-primary-400)] py-3.5 text-base font-medium text-[var(--color-base-gray)]'
               onClick={onCheckout}
            >
               {isCheckoutPage ? 'Pay Now' : 'Checkout'}
            </Button>
         )}
      </CardContent>
   )
}

export default TotalList
