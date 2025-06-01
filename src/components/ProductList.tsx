import Trash2Icon from './icons/Trash2Icon'
import QuantityPicker from './QuantityPicker'
import { Button } from './ui/button'
import Text from '@/components/ui/text'
import { Card, CardContent } from './ui/card'
import { Separator } from './ui/separator'
import { useCurrency } from '@/context/CurrencyContext'
import Image from 'next/image'
import { ProductListProps } from '@/types/ProductListProps'
import { JSX, useCallback } from 'react'

const ProductList = ({
   items,
   showCheckbox = false,
   selectedItems = [],
   toggleSelectItem,
   showTrashIcon = false,
   onRemove,
   onQuantityChange,
   showProtectionOption = false,
   protectedItems = [],
   toggleProtection,
   protectionCost = 1,
   showNotes = false,
   isNoteVisible = null,
   toggleNote,
}: ProductListProps): JSX.Element => {
   const { currency, convertCurrency, currencySymbols } = useCurrency()

   const handleToggleSelect = useCallback(
      (id: number) => {
         if (toggleSelectItem) toggleSelectItem(id)
      },
      [toggleSelectItem],
   )

   return (
      <div className='flex flex-col gap-y-8'>
         {items?.map(({ id, name, quantity, price, stock, imageUrl, categoryName }) => (
            <div key={id} className='flex items-center gap-x-8'>
               {showCheckbox && toggleSelectItem && (
                  <input
                     type='checkbox'
                     checked={selectedItems.includes(id)}
                     onChange={() => handleToggleSelect(id)}
                     className='form-checkbox h-6 w-6 accent-[var(--color-blazeOrange-600)]'
                  />
               )}
               {/* Karta Produktu */}
               <Card className='w-full rounded-md border border-[var(--color-gray-800)] bg-[var(--color-base-gray)] p-3'>
                  <CardContent className='flex flex-col gap-y-6 px-0'>
                     <div className='flex items-start gap-x-8'>
                        {/* Image Card */}
                        <Card className='h-[138px] w-[172px] rounded-md border border-[var(--color-gray-800)] bg-[var(--color-base-gray)] p-3'>
                           <Image
                              src={imageUrl}
                              alt={name}
                              width={148}
                              height={114}
                              className='h-[114px] w-[148px] rounded-md'
                           />
                        </Card>
                        {/* Product Details */}
                        <div className='flex flex-1 flex-col gap-y-4'>
                           <div className='flex flex-col gap-y-3'>
                              <div className='flex items-center justify-between'>
                                 <Text as='p' variant='h7medium' className='text-[var(--color-neutral-900)]'>
                                    {name}
                                 </Text>
                                 {/* Trash Icon */}
                                 {showTrashIcon && onRemove && (
                                    <Trash2Icon
                                       onClick={() => onRemove(id)}
                                       className='h-6 w-6 cursor-pointer text-[var(--color-blazeOrange-600)] hover:text-[var(--color-blazeOrange-800)]'
                                    />
                                 )}
                              </div>

                              <Button variant='fill' size='XS' disabled>
                                 {categoryName || 'Unknown Category'}
                              </Button>
                           </div>

                           <div className='flex items-center justify-between'>
                              <Text as='p' variant='h6medium' className='text-[var(--color-neutral-900)]'>
                                 {currencySymbols[currency] || currency}{' '}
                                 {convertCurrency(price.toFixed(2).toString(), 'USD', currency)}
                              </Text>

                              {/* Quantity and Write Note */}
                              <div className='flex items-center justify-end gap-x-6'>
                                 {/* Write Note Toggle Button */}
                                 {showNotes && toggleNote && (
                                    <button
                                       className='text-[16px] font-medium text-[var(--color-blazeOrange-600)] hover:text-[var(--color-blazeOrange-800)]'
                                       onClick={() => toggleNote(isNoteVisible === id ? -1 : id)}
                                    >
                                       Write Note
                                    </button>
                                 )}

                                 <Separator orientation='vertical' className='w-[2px] bg-[var(--color-gray-800)]' />

                                 {onQuantityChange && (
                                    <QuantityPicker
                                       quantity={quantity}
                                       setQuantity={newQuantity => onQuantityChange(id, newQuantity as number)}
                                       stock={stock}
                                       showTitle={false}
                                       size='md'
                                       hideStock={false}
                                    />
                                 )}
                              </div>
                           </div>
                        </div>
                     </div>

                     {/* Rendering Write Note Pole Tekstowe */}
                     {showNotes && toggleNote && isNoteVisible === id && (
                        <textarea
                           placeholder='Write your note here...'
                           className='mt-4 w-full rounded-md border border-[var(--color-gray-800)] bg-[var(--color-base-gray)] p-2 text-[16px] text-[var(--color-neutral-600)] placeholder:text-[var(--color-neutral-500)] focus:ring-2 focus:ring-[var(--color-blazeOrange-600)] focus:outline-none'
                        />
                     )}

                     {/* Opcja Product Protection */}
                     {showProtectionOption && toggleProtection && (
                        <div className='mt-4 flex items-center gap-x-4'>
                           <input
                              type='checkbox'
                              className='form-checkbox h-6 w-6 accent-[var(--color-blazeOrange-600)]'
                              checked={protectedItems.includes(id)}
                              onChange={() => toggleProtection(id)}
                              id={`protection-${id}`}
                           />
                           <label htmlFor={`protection-${id}`} className='w-full text-[var(--color-neutral-900)]'>
                              <div className='flex justify-between'>
                                 <Text as='p' variant='textMmedium' className='text-[var(--color-neutral-900))]'>
                                    Product Protection
                                 </Text>

                                 <Text as='p' variant='textLmedium' className='text-[var(--color-neutral-900))]'>
                                    {currencySymbols[currency] || currency}{' '}
                                    {convertCurrency(protectionCost.toFixed(2).toString(), 'USD', currency)}
                                 </Text>
                              </div>
                              <Text as='p' variant='textSmedium' className='text-[var(--color-neutral-900))]'>
                                 The claim process is easy and instant, valid for 6 months
                              </Text>
                           </label>
                        </div>
                     )}
                  </CardContent>
               </Card>
            </div>
         ))}
      </div>
   )
}

export default ProductList
