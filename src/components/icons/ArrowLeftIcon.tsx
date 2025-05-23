const ArrowLeftIcon = ({ size = 20, className }: { size?: number; className?: string }) => {
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
            d='M3.33325 10L16.6666 10M3.33325 10L8.33325 5M3.33325 10L8.33325 15'
            // stroke='#FCFCFC'
            strokeWidth='1.5'
            strokeLinecap='round'
            strokeLinejoin='round'
         />
      </svg>
   )
}
export default ArrowLeftIcon
