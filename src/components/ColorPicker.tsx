import React from 'react'
import { Button } from './ui/button'
import CheckIcon from './icons/CheckIcon'

const ColorPicker = ({
   colors,
   selectedColor,
   setSelectedColor,
}: {
   colors: { name: string; value: string }[]
   selectedColor: string
   setSelectedColor: React.Dispatch<React.SetStateAction<string>>
}) => {
   return (
      <div>
         <h4 className='pb-4 text-lg font-medium text-[var(--color-neutral-300)]'>Colors:</h4>
         <div className='mt-2 flex gap-4'>
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
