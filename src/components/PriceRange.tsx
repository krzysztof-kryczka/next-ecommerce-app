import { useCurrency } from '@/context/CurrencyContext'
import CurrencyInput from './CurrencyInput '
import { JSX, useCallback } from 'react'
import { PriceRangeProps } from '@/types/PriceRangeProps'

const PriceRange = ({ priceRange, setPriceRange }: PriceRangeProps): JSX.Element => {
   const { currency, setCurrency } = useCurrency()

   const handleChangeMin = useCallback(
      (newValue: string) => setPriceRange(prev => ({ ...prev, min: newValue })),
      [setPriceRange],
   )

   const handleChangeMax = useCallback(
      (newValue: string) => setPriceRange(prev => ({ ...prev, max: newValue })),
      [setPriceRange],
   )

   return (
      <div className='flex flex-col gap-y-4 pt-4'>
         <CurrencyInput
            value={priceRange.min}
            placeholder='$ 10.00'
            onChange={handleChangeMin}
            currency={currency}
            setCurrency={setCurrency}
         />
         <CurrencyInput
            value={priceRange.max}
            placeholder='$ Max Price'
            onChange={handleChangeMax}
            currency={currency}
            setCurrency={setCurrency}
         />
      </div>
   )
}

export default PriceRange
