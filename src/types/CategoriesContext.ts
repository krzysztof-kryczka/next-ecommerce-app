import { Category } from './Category'

export type CategoriesContextType = {
   categories: Category[]
   categoriesMap: Record<number, string>
   loading: boolean
   error: string | null
}
