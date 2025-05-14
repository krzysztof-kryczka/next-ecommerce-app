export type OrderSummary = {
   items: {
      id: number
      name: string
      price: number
      quantity: number
      stock: number
      imageUrl: string
      categoryName: string
   }[]
   totalAmount: number
}
