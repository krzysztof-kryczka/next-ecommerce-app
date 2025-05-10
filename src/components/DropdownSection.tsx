import { JSX } from 'react'
import { DropdownSectionProps } from '@/types/DropdownSectionProps'
import ChevronDownIcon from './icons/ChevronDownIcon'
import ChevronUpIcon from './icons/ChevronUpIcon'
import Text from '@/components/ui/text'

const DropdownSection = ({ title, isOpen, onToggle }: DropdownSectionProps): JSX.Element => (
   <Text
      as='p'
      variant='h7semiBold'
      className='flex cursor-pointer items-center justify-between text-[var(--color-neutral-900)]'
      onClick={onToggle}
   >
      {title} {isOpen ? <ChevronDownIcon /> : <ChevronUpIcon />}
   </Text>
)

export default DropdownSection
