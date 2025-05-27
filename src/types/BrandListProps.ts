import { Brand } from "./Brand"

export type BrandListProps = {
   selectedBrand: number | null
   setSelectedBrand: (brandId: number | null) => void
   brands: Brand[]
   setCurrentPage: (page: number) => void
   visibleBrands: number
   setVisibleBrands: React.Dispatch<React.SetStateAction<number>>
}
