import { Category } from './Category'

export type CategoryListProps = {
   selectedCategories: number[]
   // setSelectedCategories: (categories: number[]) => void
   setSelectedCategories: React.Dispatch<React.SetStateAction<number[]>>
   categories: Category[]
   // setCurrentPage: (page: number) => void
   setCurrentPage: React.Dispatch<React.SetStateAction<number>>
   visibleCategories: number
   // setVisibleCategories: (count: number) => void
   setVisibleCategories: React.Dispatch<React.SetStateAction<number>>
}
