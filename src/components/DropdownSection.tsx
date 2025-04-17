import ChevronDownIcon from './icons/ChevronDownIcon'
import ChevronUpIcon from './icons/ChevronUpIcon'

const DropdownSection: React.FC<{
   title: string
   isOpen: boolean
   onToggle: () => void
}> = ({ title, isOpen, onToggle }) => (
   <p
      onClick={onToggle}
      className='flex cursor-pointer items-center justify-between text-xl font-semibold text-[var(--color-neutral-900)]'
   >
      {title} {isOpen ? <ChevronDownIcon /> : <ChevronUpIcon />}
   </p>
)

export default DropdownSection
