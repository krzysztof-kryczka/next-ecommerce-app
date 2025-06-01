import { useCurrency } from '@/context/CurrencyContext'
import CurrencyInput from './CurrencyInput '
import { JSX, useState } from 'react'
import { PriceRangeProps } from '@/types/PriceRangeProps'

const PriceRange = ({ priceRange, setPriceRange }: PriceRangeProps): JSX.Element => {
   const { currency, setCurrency } = useCurrency()
   const [errorMessage, setErrorMessage] = useState('')

   const validatePrice = (min: number, max: number): string => {
      // if (min >= max) return 'Min price must be less than max price'
      if (max <= min) return 'Max price must be greater than min price'
      return ''
   }

   const handleChangePrice = (type: 'min' | 'max', newValue: string) => {
      setPriceRange(prev => {
         const updatedRange = { ...prev, [type]: newValue.trim() ? newValue : '' }

         const parsedMin = parseFloat(updatedRange.min)
         const parsedMax = parseFloat(updatedRange.max)

         const error = validatePrice(parsedMin, parsedMax)
         setErrorMessage(error)

         return updatedRange
      })
   }

   return (
      <div className='flex flex-col gap-y-4 pt-4'>
         <CurrencyInput
            value={priceRange.min}
            placeholder='$ 10.00'
            onChange={newValue => handleChangePrice('min', newValue)}
            currency={currency}
            setCurrency={setCurrency}
         />
         <CurrencyInput
            value={priceRange.max}
            placeholder='$ Max Price'
            onChange={newValue => handleChangePrice('max', newValue)}
            currency={currency}
            setCurrency={setCurrency}
         />
         {errorMessage && <p className='text-sm text-red-500'>{errorMessage}</p>}
      </div>
   )
}

export default PriceRange
