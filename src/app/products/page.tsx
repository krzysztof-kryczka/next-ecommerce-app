'use client'
import { useState, useEffect, useCallback, useMemo } from 'react'
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable'
import { Label } from '@/components/ui/label'
import { Product } from '@/types/Product'
import SortBySelect from '@/components/SortBySelect'
import { SortByOptions } from '@/enum/SortByOptions'
import ShowPerPageSelect from '@/components/ShowPerPageSelect'
import Pagination from '@/components/Pagination'
import DropdownSection from '@/components/DropdownSection'
import CategoryList from '@/components/CategoryList'
import PriceRange from '@/components/PriceRange'
import { useSearchParams } from 'next/navigation'
import ProductCard from '@/components/ProductCard'
import { useCategories } from '@/context/CategoriesContext'
import useFetch from '@/hooks/useFetch'
import { useCurrency } from '@/context/CurrencyContext'
import { PriceRange as PriceRangeType } from '@/types/PriceRange'
import ErrorMessage from '@/components/ui/ErrorMessage'
import LoadingIndicator from '@/components/ui/LoadingIndicator'
import { Brand } from '@/types/Brand'
import BrandList from '@/components/BrandList'
import Text from '@/components/ui/text'

export default function ProductsPage() {
   const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
   const [sortBy, setSortBy] = useState<SortByOptions>(SortByOptions.Latest)
   const [showPerPage, setShowPerPage] = useState<number>(9)
   const [priceRange, setPriceRange] = useState<PriceRangeType>({ min: '', max: '' })
   const [currentPage, setCurrentPage] = useState<number>(1)
   const [totalPages, setTotalPages] = useState<number>(1)
   const [isProductOpen, setIsProductOpen] = useState<boolean>(true)
   const [isBrandOpen, setIsBrandOpen] = useState<boolean>(true)
   const [isPriceOpen, setIsPriceOpen] = useState<boolean>(true)
   const [visibleCategories, setVisibleCategories] = useState<number>(4)
   const [selectedCategories, setSelectedCategories] = useState<number[]>([])
   const { categories, loading: categoriesLoading } = useCategories()
   const searchParams = useSearchParams()
   // const selectedParam = searchParams?.getAll('selected[]') || []
   //const brandIdParam = searchParams?.get('brandId')
   const [brandIdParam, setBrandIdParam] = useState<number | null>(
      searchParams?.get('brandId') ? parseInt(searchParams.get('brandId')!, 10) : null,
   )
   const [visibleBrands, setVisibleBrands] = useState<number>(5)

   const { currency, convertCurrency } = useCurrency()
   const { data: brands, loading: brandsLoading, error: brandsError } = useFetch<Brand>('/api/brands', {}, false, true, 'brandsCache')
   const {
      data: response,
      loading,
      error,
   } = useFetch<{ success: boolean; data: Product[] }>('/api/products', {}, false, false, 'productsCache')
   //const products = response && 'data' in response ? response.data : []
   const products = useMemo(() => (response && 'data' in response ? response.data : []), [response])

   useEffect(() => {
      const selectedParam = searchParams?.getAll('selected[]') || []
      const selectedIds = selectedParam.map(id => parseInt(id, 10)).filter(id => !isNaN(id))

      if (JSON.stringify(selectedCategories) !== JSON.stringify(selectedIds)) {
         setSelectedCategories(selectedIds)
         setCurrentPage(1)
      }
   }, [searchParams, selectedCategories])

   const handleCategoryChange: React.Dispatch<React.SetStateAction<number[]>> = newCategories => {
      setSelectedCategories(newCategories)
      if (newCategories.length === 0) {
         window.history.replaceState(null, '', '/products')
      } else {
         const params = Array.isArray(newCategories) ? newCategories.map(id => `selected[]=${id}`).join('&') : ''
         window.history.replaceState(null, '', `/products?${params}`)
      }
   }

   useEffect(() => {
      if (!products || loading) return

      const minPriceUSD = priceRange.min ? Number(convertCurrency(priceRange.min, currency, 'USD')) || 0 : 0
      const maxPriceUSD = priceRange.max
         ? Number(convertCurrency(priceRange.max, currency, 'USD')) || Number.MAX_SAFE_INTEGER
         : Number.MAX_SAFE_INTEGER

      if (minPriceUSD >= maxPriceUSD || maxPriceUSD <= minPriceUSD) {
         setFilteredProducts([])
         setTotalPages(0)
         return
      }

      let filtered = [...products]

      if (brandIdParam) {
         const brandId = Number(brandIdParam)
         if (!isNaN(brandId)) {
            filtered = filtered.filter(product => product.brandId === brandId)
         }
      }

      filtered = filtered.filter(
         product => Number(product.price) >= minPriceUSD && Number(product.price) <= maxPriceUSD,
      )

      if (selectedCategories.length > 0) {
         filtered = filtered.filter(product => selectedCategories.includes(product.categoryId))
      }

      if (sortBy === 'price_asc') {
         filtered = filtered.sort((a, b) => Number(a.price) - Number(b.price))
      } else if (sortBy === 'price_desc') {
         filtered = filtered.sort((a, b) => Number(b.price) - Number(a.price))
      } else if (sortBy === 'latest') {
         filtered = filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      }

      setFilteredProducts(filtered)
      setTotalPages(Math.ceil(filtered.length / showPerPage))
      setCurrentPage(1)
   }, [
      brandIdParam,
      selectedCategories,
      priceRange.min,
      priceRange.max,
      sortBy,
      products,
      showPerPage,
      currency,
      convertCurrency,
      loading,
   ])

   const paginatedProducts = filteredProducts.slice((currentPage - 1) * showPerPage, currentPage * showPerPage)

   // Funkcja generująca dynamiczne przyciski paginacji
   function getPaginationButtons(currentPage: number, totalPages: number) {
      const buttons = []
      buttons.push(1)

      // Dodaj ... po 1 stronie, jeśli różnica jest większa od 2
      if (currentPage > 3) {
         buttons.push('...')
      }

      // Dodaj przyciski wokół aktualnej strony
      for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
         buttons.push(i)
      }

      // Dodaj ... przed ostatnią stroną, jeśli różnica jest większa niż 2
      if (currentPage < totalPages - 2) {
         buttons.push('...')
      }

      // Dodaj ostatnią stronę, jeśli jest większa od 1
      if (totalPages > 1) {
         buttons.push(totalPages)
      }

      // Usuń zduplikowane ...
      return buttons.filter((value, index, self) => !(value === '...' && self[index - 1] === '...'))
   }

   const handleSortChange = useCallback(
      (value: SortByOptions) => {
         setSortBy(value)
         setCurrentPage(1)
      },
      [setSortBy, setCurrentPage],
   )

   const handleBrandChange = (brandId: number | null) => {
      setBrandIdParam(brandId)
      window.history.replaceState(null, '', brandId ? `/products?brandId=${brandId}` : '/products')
   }

   return (
      <div className='px-6 sm:px-8 md:px-10'>
         <ResizablePanelGroup
            direction='horizontal'
            className='h-full w-full border-t border-t-[var(--color-gray-800)]'
         >
            {/* Lewy panel */}
            <ResizablePanel defaultSize={25} className='h-full p-4'>
               <DropdownSection
                  title='Category'
                  isOpen={isProductOpen}
                  onToggle={() => setIsProductOpen(!isProductOpen)}
               />
               {isProductOpen && (
                  <CategoryList
                     selectedCategories={selectedCategories}
                     setSelectedCategories={handleCategoryChange}
                     categories={categories}
                     setCurrentPage={setCurrentPage}
                     visibleCategories={visibleCategories}
                     setVisibleCategories={setVisibleCategories}
                  />
               )}

               <DropdownSection title='Brand' isOpen={isBrandOpen} onToggle={() => setIsBrandOpen(!isBrandOpen)} />

               {isBrandOpen && (
                  <>
                     {brandsLoading ? (
                        <LoadingIndicator />
                     ) : brandsError ? (
                        <ErrorMessage sectionName='brands' errorDetails={brandsError} />
                     ) : Array.isArray(brands) && brands.length > 0 ? (
                        <BrandList
                           selectedBrand={brandIdParam}
                           setSelectedBrand={handleBrandChange}
                           brands={brands}
                           setCurrentPage={setCurrentPage}
                           visibleBrands={visibleBrands}
                           setVisibleBrands={setVisibleBrands}
                        />
                     ) : (
                        <p className='text-center text-lg font-semibold text-red-500'>No brands available.</p>
                     )}
                  </>
               )}

               <div className='mt-10'>
                  <DropdownSection title='Price' isOpen={isPriceOpen} onToggle={() => setIsPriceOpen(!isPriceOpen)} />
                  {isPriceOpen && <PriceRange priceRange={priceRange} setPriceRange={setPriceRange} />}
               </div>
            </ResizablePanel>

            {/* Rozdzielacz */}
            <ResizableHandle className='bg-[var(--color-gray-800)]' />

            {/* Prawy panel */}
            <ResizablePanel defaultSize={70} className='h-full overflow-y-auto'>
               <div className='flex w-full flex-col'>
                  <div className='flex w-full flex-wrap items-center gap-6 p-6 sm:gap-12 sm:p-10'>
                     <div className='flex gap-x-4'>
                        <Label variant='custom' className='text-xl font-semibold'>
                           Sort By
                        </Label>
                        <SortBySelect sortBy={sortBy} setSortBy={handleSortChange} />
                     </div>

                     <div className='flex gap-x-4'>
                        <Label variant='custom' className='text-xl font-semibold'>
                           Show
                        </Label>
                        <ShowPerPageSelect
                           showPerPage={showPerPage}
                           setShowPerPage={setShowPerPage}
                           setCurrentPage={setCurrentPage}
                        />
                     </div>
                  </div>

                  {error ? (
                     <ErrorMessage sectionName='products.' errorDetails={error} />
                  ) : loading || categoriesLoading ? (
                     <LoadingIndicator />
                  ) : parseFloat(priceRange.min) >= parseFloat(priceRange.max) ||
                    parseFloat(priceRange.max) <= parseFloat(priceRange.min) ? (
                     <div className='flex min-h-[50vh] items-center justify-center'>
                        <p className='text-center text-lg font-semibold text-red-500'></p>
                        <Text as='p' variant='textLregular' className='text-[var(--color-danger-700)]'>
                           ⚠️ Invalid price range. Please adjust your filters!!!
                        </Text>
                     </div>
                  ) : filteredProducts.length === 0 ? (
                     <div className='flex min-h-[50vh] items-center justify-center'>
                        <Text as='p' variant='textLregular' className='text-[var(--color-danger-700)]'>
                           No products found in the selected price range. Try adjusting your filters!
                        </Text>
                     </div>
                  ) : (
                     <div className='xs:grid-cols-1 grid gap-x-6 gap-y-8 px-6 sm:grid-cols-1 sm:gap-x-8 sm:px-8 md:grid-cols-2 md:gap-x-10 md:px-10 lg:grid-cols-3 xl:grid-cols-3'>
                        {paginatedProducts.map(product => (
                           <ProductCard key={product.id} product={product} />
                        ))}
                     </div>
                  )}

                  {totalPages > 1 && (
                     <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        setCurrentPage={setCurrentPage}
                        getPaginationButtons={getPaginationButtons}
                     />
                  )}
               </div>
            </ResizablePanel>
         </ResizablePanelGroup>
      </div>
   )
}
