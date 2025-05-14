export type TotalListProps = {
   items: {
      id: number
      name: string
      price: number
      quantity: number
   }[]
   selectedItems?: number[]
   onCheckout?: () => void
   showCheckoutButton?: boolean
   isCheckoutPage?: boolean
   productProtectionPrice?: number
   shippingPrice?: number
   shippingInsurancePrice?: number
   serviceFees?: number
}
