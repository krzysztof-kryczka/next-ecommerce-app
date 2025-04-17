import { Category } from './Category'

export type CategoryListProps = {
   selectedCategories: number[]
   setSelectedCategories: React.Dispatch<React.SetStateAction<number[]>>
   categories: Category[]
   setCurrentPage: (page: number) => void
   visibleCategories: number
   setVisibleCategories: (count: number) => void
}
