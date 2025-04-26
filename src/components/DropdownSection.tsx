import ChevronDownIcon from './icons/ChevronDownIcon'
import ChevronUpIcon from './icons/ChevronUpIcon'
import Text from '@/components/ui/text'

const DropdownSection: React.FC<{
   title: string
   isOpen: boolean
   onToggle: () => void
}> = ({ title, isOpen, onToggle }) => (
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
