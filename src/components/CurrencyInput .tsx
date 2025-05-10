import React, { JSX, useState } from 'react'
import { Input } from './ui/input'
import { Select, SelectTrigger, SelectContent, SelectItem } from './ui/select'
import { CurrencyInputProps } from '@/types/CurrencyInputProps'

const CurrencyInput = ({ value, onChange, placeholder, currency, setCurrency }: CurrencyInputProps): JSX.Element => {
   const [inputValue, setInputValue] = useState<string>(value)
   const currencies = ['USD', 'EUR', 'GBP', 'PLN']

   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value
      if (isNaN(Number(newValue))) return
      setInputValue(newValue)
      onChange(newValue)
   }

   const handleCurrencyChange = (newCurrency: string) => {
      setCurrency(newCurrency)
   }

   return (
      <div className='flex items-center'>
         <Input
            type='text'
            variant='custom'
            value={inputValue}
            onChange={handleInputChange}
            placeholder={placeholder}
            className='rounded-tr-none rounded-br-none'
         />

         <Select value={currency} onValueChange={handleCurrencyChange}>
            <SelectTrigger variant='custom' className='rounded-tl-none rounded-bl-none border-l-0'>
               {currency}
            </SelectTrigger>
            <SelectContent>
               {currencies.map(curr => (
                  <SelectItem key={curr} value={curr}>
                     {curr}
                  </SelectItem>
               ))}
            </SelectContent>
         </Select>
      </div>
   )
}

export default CurrencyInput
