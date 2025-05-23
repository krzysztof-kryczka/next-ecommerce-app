import { Separator } from '@/components/ui/separator'
import { CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Text from '@/components/ui/text'
import { useCurrency } from '@/context/CurrencyContext'
import { JSX } from 'react'
import { TotalListProps } from '@/types/TotalListProps'

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
}: TotalListProps): JSX.Element => {
   const { currency, convertCurrency, currencySymbols } = useCurrency()

   const filteredItems = selectedItems.length > 0 ? items.filter(item => selectedItems.includes(item.id)) : items

   const subtotal = filteredItems?.reduce((total, item) => total + item.price * item.quantity, 0)
   const grandTotal =
      subtotal + (isCheckoutPage ? productProtectionPrice + shippingPrice + shippingInsurancePrice + serviceFees : 0)

   return (
      <CardContent className='px-0'>
         <div className='flex flex-col pb-4'>
            <div className='flex flex-col gap-y-4 text-base font-medium text-[var(--color-neutral-900)]'>
               {filteredItems?.map(item => (
                  <div key={item.id} className='flex justify-between'>
                     <Text as='p' variant='textMmedium' className='text-[var(--color-neutral-100))]'>
                        {item.name} ({item.quantity}×
                        {convertCurrency(item.price.toFixed(2).toString(), 'USD', currency)})
                     </Text>
                     <Text as='p' variant='textLmedium' className='text-[var(--color-neutral-900))]'>
                        {currencySymbols[currency] || currency}{' '}
                        {convertCurrency((item.quantity * item.price).toFixed(2).toString(), 'USD', currency)}
                     </Text>
                  </div>
               ))}
            </div>
         </div>

         {isCheckoutPage && (
            <div className='flex flex-col gap-y-4'>
               <div className='flex justify-between'>
                  <Text as='p' variant='textMmedium' className='text-[var(--color-neutral-100))]'>
                     Product Protection:
                  </Text>
                  <Text as='p' variant='textLmedium' className='text-[var(--color-neutral-900))]'>
                     {currencySymbols[currency] || currency}{' '}
                     {convertCurrency(productProtectionPrice.toFixed(2).toString(), 'USD', currency)}
                  </Text>
               </div>
               <div className='flex justify-between'>
                  <Text as='p' variant='textMmedium' className='text-[var(--color-neutral-100))]'>
                     Shipping Price:
                  </Text>
                  <Text as='p' variant='textLmedium' className='text-[var(--color-neutral-900))]'>
                     {currencySymbols[currency] || currency}{' '}
                     {convertCurrency(shippingPrice.toFixed(2).toString(), 'USD', currency)}
                  </Text>
               </div>
               <div className='flex justify-between'>
                  <Text as='p' variant='textMmedium' className='text-[var(--color-neutral-100))]'>
                     Shipping Insurance:
                  </Text>
                  <Text as='p' variant='textLmedium' className='text-[var(--color-neutral-900))]'>
                     {currencySymbols[currency] || currency}{' '}
                     {convertCurrency(shippingInsurancePrice.toFixed(2).toString(), 'USD', currency)}
                  </Text>
               </div>
               <Separator className='my-2 bg-[var(--color-gray-800)]' />
               <div className='flex flex-col gap-y-4'>
                  <Text as='p' variant='textLmedium' className='text-[var(--color-neutral-900))]'>
                     Transaction Fees
                  </Text>
                  <div className='flex justify-between'>
                     <Text as='p' variant='textMmedium' className='text-[var(--color-neutral-100))]'>
                        Service Fees:
                     </Text>
                     <Text as='p' variant='textLmedium' className='text-[var(--color-neutral-900))]'>
                        {currencySymbols[currency] || currency}{' '}
                        {convertCurrency(serviceFees.toFixed(2).toString(), 'USD', currency)}
                     </Text>
                  </div>
               </div>
            </div>
         )}

         <Separator className='my-6 bg-[var(--color-gray-800)]' />
         <div className='align-center flex items-center justify-between pb-6'>
            <Text as='p' variant='textLmedium' className='text-[var(--color-neutral-900))]'>
               Grand Total:
            </Text>
            <Text as='p' variant='h5medium' className='text-[var(--color-neutral-900))]'>
               {currencySymbols[currency] || currency}{' '}
               {convertCurrency(grandTotal.toFixed(2).toString(), 'USD', currency)}
            </Text>
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
