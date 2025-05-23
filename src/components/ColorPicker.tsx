import React, { JSX } from 'react'
import { Button } from './ui/button'
import Text from '@/components/ui/text'
import { ColorPickerProps } from '@/types/ColorPickerProps'

const ColorPicker = ({ colors, selectedColor, setSelectedColor }: ColorPickerProps): JSX.Element => {
   return (
      <div>
         <Text as='h4' variant='textLmedium' className='pb-3.5 text-[var(--color-neutral-300)]'>
            Colors:
         </Text>
         <div className='flex gap-4'>
            {colors.map(color => (
               <Button
                  variant='stroke'
                  key={color.name}
                  className={`flex h-16 w-16 items-center justify-center ${
                     selectedColor === color.name
                        ? `${color.value} border-none` // Zaznaczony przycisk bez obramowania
                        : `${color.value} border-[var(--color-gray-600)]` // Niezaznaczony przycisk z obramowaniem
                  }`}
                  onClick={() => setSelectedColor(color.name)}
               >
                  {selectedColor === color.name && (
                     <div className='flex items-center justify-center text-4xl text-[var(--color-base-gray)]'>✓</div>
                  )}
               </Button>
            ))}
         </div>
      </div>
   )
}

export default ColorPicker
