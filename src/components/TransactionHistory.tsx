import { JSX } from 'react'
import { Card } from '@/components/ui/card'
import Text from '@/components/ui/text'
import BagIcon from '@/components/icons/BagIcon'
import { useCurrency } from '@/context/CurrencyContext'
import { Order } from '@/types/Order'
import { formatDate } from '@/lib/helpers'

const TransactionHistory = ({ orders }: { orders: Order[] }): JSX.Element => {
   const { currency, currencySymbols, convertCurrency } = useCurrency()

   return (
      <div className='mx-auto flex w-full flex-col gap-y-6'>
         {orders.map(order => (
            <Card
               key={order.id}
               className='flex w-full flex-col gap-y-4 border border-[var(--color-gray-800)] bg-[var(--color-base-gray)] p-6'
            >
               {/* Górny rząd: ikona, data, cena */}
               <div className='flex items-center justify-between'>
                  <div className='flex items-center gap-x-2'>
                     <BagIcon />
                     <Text as='p' variant='textMregular' className='text-[var(--color-neutral-100)]'>
                        {formatDate(order.date)}
                     </Text>
                  </div>
                  <Text as='p' variant='h6medium' className='text-[var(--color-neutral-900)]'>
                     {currencySymbols[currency] || currency}{' '}
                     {convertCurrency(Number(order.amount).toFixed(2), 'USD', currency)}
                  </Text>
               </div>

               {/* Dolna sekcja: zdjęcie + pozostałe dane */}
               <div className='flex items-center gap-x-6'>
                  {order.items.length > 0 && (
                     <div className='flex h-[80px] w-[100px] items-center justify-center overflow-hidden rounded-md border border-[var(--color-gray-800)] p-[12px]'>
                        <img
                           src={order.items[0].imageUrl}
                           alt={order.items[0].productName}
                           className='h-full w-full object-cover'
                        />
                     </div>
                  )}

                  <div className='flex flex-col'>
                     <Text as='p' variant='textMregular' className='font-semibold'>
                        {order.items.length > 0 ? order.items[0].productName : 'Brak produktów'}
                     </Text>
                     {order.items.length > 0 && (
                        <Text as='p' variant='textSmedium' className='text-[var(--color-neutral-400)]'>
                           {currencySymbols[currency] || currency}{' '}
                           {convertCurrency(order.items[0].priceAtPurchase, 'USD', currency)} x{' '}
                           {order.items[0].quantity}
                        </Text>
                     )}
                     <Text as='p' variant='textSmedium' className='text-[var(--color-neutral-400)]'>
                        Order no INV/{new Date().getFullYear()}/{order.orderNumber}
                     </Text>
                  </div>
               </div>
            </Card>
         ))}
      </div>
   )
}

export default TransactionHistory
