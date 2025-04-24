import { Category } from './Category'

export type CategoryListProps = {
   selectedCategories: number[]
   setSelectedCategories: (categories: number[]) => void
   categories: Category[]
   setCurrentPage: (page: number) => void
   visibleCategories: number
   setVisibleCategories: (count: number) => void
}
