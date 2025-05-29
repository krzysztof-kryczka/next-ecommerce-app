import React, { JSX } from 'react'
import { Button } from './ui/button'
import Text from '@/components/ui/text'
import { ColorPickerProps } from '@/types/ColorPickerProps'

const tailwindColorMap: Record<string, string> = {
   white: 'bg-white',
   black: 'bg-black',
   red: 'bg-red-500',
   blue: 'bg-blue-500',
   green: 'bg-green-500',
   pink: 'bg-pink-500',
   purple: 'bg-purple-500',
   orange: 'bg-orange-500',
   yellow: 'bg-yellow-500',
   gray: 'bg-gray-500',
}

const ColorPicker = ({ colors, selectedColor, setSelectedColor }: ColorPickerProps): JSX.Element => {
   console.log('Selected Color:', selectedColor)
   console.log('Available Colors:', colors)

   return (
      <div>
         <Text as='h4' variant='textLmedium' className='pb-3.5 text-[var(--color-neutral-300)]'>
            Colors:
         </Text>
         <div className='flex gap-4'>
            {colors.map(color => {
               const tailwindClass = tailwindColorMap[color.name.toLowerCase()] || 'bg-gray-500'
               return (
                  <Button
                     variant='stroke'
                     key={color.name}
                     className={`flex h-16 w-16 items-center justify-center ${tailwindClass} border-[var(--color-gray-600)]`}
                     onClick={() => setSelectedColor(color.name)}
                  >
                     {selectedColor === color.name && (
                        <div className='flex items-center justify-center text-4xl text-[var(--color-base-gray)]'>✓</div>
                     )}
                  </Button>
               )
            })}
         </div>
      </div>
   )
}

export default ColorPicker
