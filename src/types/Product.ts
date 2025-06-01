import { ProductVariant } from './ProductVariant'

export type Product = {
   id: number
   name: string
   price: number
   categoryId: number
   brandId: number
   imageUrl: string[]
   createdAt: string
   quantity: number
   stock?: number
   variantId?: number
   variants: ProductVariant[]
   description?: string
   deliveryDateRange: {
      startDate?: string
      endDate?: string
   }
   categoryName?: string
}
