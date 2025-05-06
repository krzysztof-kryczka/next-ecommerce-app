'use client'
import { useState, useEffect, useCallback } from 'react'
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable'
import { Label } from '@/components/ui/label'
import { Product } from '@/types/Product'
import SortBySelect from '@/components/SortBySelect'
import { SortByOptions } from '@/types/SortByOptions'
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

export default function ProductsPage() {
   const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  const [sortBy, setSortBy] = useState<SortByOptions>(SortByOptions.Latest)
   const [showPerPage, setShowPerPage] = useState<number>(9)
   const [priceRange, setPriceRange] = useState({ min: '', max: '' })
   const [currentPage, setCurrentPage] = useState<number>(1)
   const [totalPages, setTotalPages] = useState<number>(1)
   const [isProductOpen, setIsProductOpen] = useState<boolean>(true)
   const [isPriceOpen, setIsPriceOpen] = useState<boolean>(true)
   const [visibleCategories, setVisibleCategories] = useState<number>(4)
   const [selectedCategories, setSelectedCategories] = useState<number[]>([])
   const { categories, loading: categoriesLoading } = useCategories()
   const searchParams = useSearchParams()
   const selectedParam = searchParams?.getAll('selected[]') || []
   const brandIdParam = searchParams?.get('brandId')
   const { currency, convertCurrency } = useCurrency()
   const {
      data: response,
      loading,
      error,
   } = useFetch<{ success: boolean; data: Product[] }>('/api/products', {}, false, false)
   const products = response && 'data' in response ? response.data : []

   useEffect(() => {
      // Zamieniamy URL na tablicę liczb
      const selectedIds = selectedParam.map(id => parseInt(id, 10)).filter(id => !isNaN(id))
      // gdy stan się różni, zaktualizuj selectedCategories
      if (JSON.stringify(selectedCategories) !== JSON.stringify(selectedIds)) {
         setSelectedCategories(selectedIds)
         setCurrentPage(1)
      }
   }, [selectedParam, selectedCategories])

   const handleCategoryChange = (newCategories: number[]) => {
      setSelectedCategories(newCategories)

      if (newCategories.length === 0) {
         // Usuń wszystkie dodane parametry z adresu URL, jeśli -> All
         window.history.replaceState(null, '', '/products')
      } else {
         // Dodaj parametry do URL jęsli zaznaczono wiele kategorii
         // Zamieniamy tablicę na parametry URL
         const params = newCategories.map(id => `selected[]=${id}`).join('&')
         const url = `/products?${params}`
         window.history.replaceState(null, '', url)
      }
   }

   useEffect(() => {
      if (!products || loading) return

      let filtered = [...products]

      if (brandIdParam) {
         const brandId = parseInt(brandIdParam, 10)
         if (!isNaN(brandId)) {
            filtered = filtered.filter(product => product.brandId === brandId)
         }
      }

      const minPriceUSD = priceRange.min ? convertCurrency(priceRange.min, currency, 'USD') : 0
      const maxPriceUSD = priceRange.max ? convertCurrency(priceRange.max, currency, 'USD') : Number.MAX_SAFE_INTEGER

      filtered = filtered.filter(
         product => Number(product.price) >= Number(minPriceUSD) && Number(product.price) <= Number(maxPriceUSD),
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

      if (JSON.stringify(filteredProducts) !== JSON.stringify(filtered)) {
         setFilteredProducts(filtered)
         setTotalPages(Math.ceil(filtered.length / showPerPage))
      }
   }, [brandIdParam, selectedCategories, priceRange, sortBy, products, showPerPage, currency])

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
   console.log('waluta:', currency)

   const handleSortChange = useCallback(
      (value: SortByOptions) => {
         setSortBy(value)
         setCurrentPage(1)
      },
      [setSortBy, setCurrentPage],
   )

   return (
      <div className='px-10'>
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

               <div className='mt-[52px]'>
                  <DropdownSection title='Price' isOpen={isPriceOpen} onToggle={() => setIsPriceOpen(!isPriceOpen)} />
                  {isPriceOpen && <PriceRange priceRange={priceRange} setPriceRange={setPriceRange} />}
               </div>
            </ResizablePanel>

            {/* Rozdzielacz */}
            <ResizableHandle className='bg-[var(--color-gray-800)]' />

            {/* Prawy panel */}
            <ResizablePanel defaultSize={70} className='h-full overflow-y-auto'>
               <div className='flex w-full flex-col'>
                  <div className='flex w-full items-center gap-[60px] p-10'>
                     <div className='flex gap-x-4'>
                        <Label variant='custom' className='text-xl leading-[30px] font-semibold tracking-[-0.01em]'>
                           Sort By
                        </Label>
                        <SortBySelect sortBy={sortBy} setSortBy={handleSortChange} />
                     </div>

                     <div className='flex gap-x-4'>
                        <Label variant='custom' className='text-xl leading-[30px] font-semibold tracking-[-0.01em]'>
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
                     <p className='text-center text-lg text-red-500'>{error}</p>
                  ) : loading || categoriesLoading ? (
                     <p className='text-center text-lg text-gray-500'>Loading products...</p>
                  ) : (
                     <div className='grid grid-cols-3 gap-x-12 gap-y-8 px-10'>
                        {paginatedProducts.map(product => (
                           <ProductCard key={product.id} product={product} />
                        ))}
                     </div>
                  )}
                  <Pagination
                     currentPage={currentPage}
                     totalPages={totalPages}
                     setCurrentPage={setCurrentPage}
                     getPaginationButtons={getPaginationButtons}
                  />
               </div>
            </ResizablePanel>
         </ResizablePanelGroup>
      </div>
   )
}
