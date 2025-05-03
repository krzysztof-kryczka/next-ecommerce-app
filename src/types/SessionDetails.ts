import { Item } from './Item'

export type SessionDetails = {
   transactionDate: string
   amount: number
   paymentIntentId: string
   paymentMethod: string
   shippingMethod: string
   productProtectionPrice: number
   shippingPrice: number
   shippingInsurancePrice: number
   serviceFees: number
   status: string
   created: number
   products: Item[]
}
