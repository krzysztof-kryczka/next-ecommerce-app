export type Order = {
   id: number
   orderNumber: string
   date: string
   amount: string
   items: { productName: string; quantity: number; imageUrl: string; priceAtPurchase: string }[]
}
