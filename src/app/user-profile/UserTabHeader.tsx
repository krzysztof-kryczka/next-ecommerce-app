import { JSX } from 'react'
import { Separator } from '@/components/ui/separator'
import Text from '@/components/ui/text'

const TabHeader = ({ title, description }: { title: string; description: string }): JSX.Element => (
   <div className='flex flex-col gap-y-1 sm:gap-y-2 lg:gap-y-2'>
      <Text as='h6' variant='h6medium' className='text-[var(--color-neutral-900)]'>
         {title}
      </Text>
      <Text as='p' variant='textMregular' className='text-[var(--color-neutral-100)]'>
         {description}
      </Text>
      <Separator className='mt-1 bg-[var(--color-gray-800)] sm:mt-2' />
   </div>
)

export default TabHeader
