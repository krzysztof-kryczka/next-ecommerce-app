import { ProductItem } from './ProductItem'

export type ProductListProps = {
   items: ProductItem[]
   showCheckbox?: boolean
   selectedItems?: number[]
   toggleSelectItem?: (id: number) => void
   showTrashIcon?: boolean
   onRemove?: (id: number) => void
   onQuantityChange?: (id: number, quantity: number) => void
   showProtectionOption?: boolean
   protectedItems?: number[]
   toggleProtection?: (id: number) => void
   protectionCost?: number
   showNotes?: boolean
   isNoteVisible?: number | null
   toggleNote?: (id: number) => void
}
