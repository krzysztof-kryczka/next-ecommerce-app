import React, { useState } from 'react'
import { Input } from './ui/input'
import { Select, SelectTrigger, SelectContent, SelectItem } from './ui/select'

type CurrencyInputProps = {
   value: string
   onChange: (newValue: string) => void
   placeholder?: string
   currency: string
   setCurrency: (newCurrency: string) => void
}

const CurrencyInput: React.FC<CurrencyInputProps> = ({ value, onChange, placeholder, currency, setCurrency }) => {
   const [inputValue, setInputValue] = useState<string>(value || '')
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
