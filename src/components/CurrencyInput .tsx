import React, { useState } from 'react'
import { Input } from './ui/input'
import { Select, SelectTrigger, SelectContent, SelectItem } from './ui/select'

const CurrencyInput: React.FC<{
   value: string
   onChange: (newValue: string) => void
   placeholder?: string
}> = ({ value, onChange, placeholder }) => {
   const [inputValue, setInputValue] = useState<string>(value || '')
   const [currency, setCurrency] = useState<string>('USD')

   const currencies = ['USD', 'EUR', 'GBP', 'PLN']

   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value
      setInputValue(newValue)
      onChange(newValue)
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

         {/* Select z shadcn/ui */}
         <Select value={currency} onValueChange={setCurrency}>
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
