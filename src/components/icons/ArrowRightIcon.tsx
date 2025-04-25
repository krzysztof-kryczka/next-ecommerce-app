const ArrowRightIcon = ({ size = 20, className }: { size?: number; className?: string }) => {
   return (
      <svg
         width={size}
         height={size}
         viewBox='0 0 20 20'
         fill='none'
         className={className}
         xmlns='http://www.w3.org/2000/svg'
      >
         <path
            d='M16.6666 10L3.33325 10M16.6666 10L11.6666 15M16.6666 10L11.6666 5'
            // stroke='#FCFCFC'
            strokeWidth='1.5'
            strokeLinecap='round'
            strokeLinejoin='round'
         />
      </svg>
   )
}
export default ArrowRightIcon
