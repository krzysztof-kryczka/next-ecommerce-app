const PlusIcon = ({ size = 24, className }: { size?: number; className?: string }) => {
   return (
      <svg
         width={size}
         height={size}
         viewBox='0 0 24 24'
         fill='none'
         className={className}
         xmlns='http://www.w3.org/2000/svg'
      >
         <path d='M4 12H20M12 4V20' stroke='#FCFCFC' strokeWidth='1.5' strokeLinecap='round' strokeLinejoin='round' />
      </svg>
   )
}

export default PlusIcon
