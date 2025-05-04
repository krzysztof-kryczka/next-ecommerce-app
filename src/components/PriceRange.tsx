import { useCurrency } from '@/context/CurrencyContext'
import CurrencyInput from './CurrencyInput '

const PriceRange: React.FC<{
   priceRange: { min: string; max: string }
   setPriceRange: (range: { min: string; max: string }) => void
}> = ({ priceRange, setPriceRange }) => {
   const { currency, setCurrency } = useCurrency()

   return (
      <div className='flex flex-col gap-y-4 pt-4'>
         <CurrencyInput
            value={priceRange.min}
            placeholder='$ 10.00'
            onChange={newValue => setPriceRange({ ...priceRange, min: newValue })}
            currency={currency}
            setCurrency={setCurrency}
         />

         <CurrencyInput
            value={priceRange.max}
            placeholder='$ Max Price'
            onChange={newValue => setPriceRange({ ...priceRange, max: newValue })}
            currency={currency}
            setCurrency={setCurrency}
         />
      </div>
   )
}

export default PriceRange
