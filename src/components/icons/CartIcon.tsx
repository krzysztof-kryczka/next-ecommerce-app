const CartIcon = ({ size = 24, className }: { size?: number; className?: string }) => {
   return (
      <svg
         width={size}
         height={size}
         viewBox='0 0 24 24'
         fill='none'
         className={className}
         xmlns='http://www.w3.org/2000/svg'
      >
         <path
            d='M2 3H4.5L6.5 17H17M17 17C15.8954 17 15 17.8954 15 19C15 20.1046 15.8954 21 17 21C18.1046 21 19 20.1046 19 19C19 17.8954 18.1046 17 17 17ZM6.07142 14H18L21 5H4.78571M11 19C11 20.1046 10.1046 21 9 21C7.89543 21 7 20.1046 7 19C7 17.89543 7.89543 17 9 17C10.1046 17 11 17.89543 11 19Z'
            stroke='currentColor'
            strokeLinecap='round'
            strokeLinejoin='round'
         />
      </svg>
   )
}

export default CartIcon
