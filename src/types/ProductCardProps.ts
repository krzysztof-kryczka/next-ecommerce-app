import { ProductVariant } from './ProductVariant'

export type ProductCardProps = {
   product: {
      id: number
      name: string
      price: number
      imageUrl: string[]
      categoryId: number
      variants: ProductVariant[]
   }
}
