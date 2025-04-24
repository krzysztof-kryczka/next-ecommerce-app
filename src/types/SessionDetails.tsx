import { Item } from "./Item"

export type SessionDetails = {
   items: Item[]
   transactionDate: string
   amount: number
   paymentIntentId: string
   paymentMethod: string
   shippingMethod: string
   productProtectionPrice: number
   shippingPrice: number
   shippingInsurancePrice: number
   serviceFees: number
}
