'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable'
import { Label } from '@/components/ui/label'

import { Button } from '@/components/ui/button'
import CartIcon from '@/components/icons/CartIcon'
import { Product } from '@/types/Product'
import { Category } from '@/types/Category'
import SortBySelect from '@/components/SortBySelect'
import { SortByOptions } from '@/types/SortByOptions'
import ShowPerPageSelect from '@/components/ShowPerPageSelect'
import Pagination from '@/components/Pagination'
import DropdownSection from '@/components/DropdownSection'
import CategoryList from '@/components/CategoryList'
import PriceRange from '@/components/PriceRange'
import { PriceRangeType } from '@/types/PriceRangeType'
import { useSearchParams } from 'next/navigation'

export default function ProductsPage() {
   const [categories, setCategories] = useState<Category[]>([])
   const [products, setProducts] = useState<Product[]>([])
   const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
   const [loading, setLoading] = useState<boolean>(true)
   const [sortBy, setSortBy] = useState<SortByOptions>('latest')
   const [showPerPage, setShowPerPage] = useState<number>(9)
   const [priceRange, setPriceRange] = useState<PriceRangeType>({ min: '', max: '' })
   const [currentPage, setCurrentPage] = useState<number>(1)
   const [totalPages, setTotalPages] = useState<number>(1)
   const [categoriesMap, setCategoriesMap] = useState<Record<number, string>>({})
   const [isProductOpen, setIsProductOpen] = useState<boolean>(true)
   const [isPriceOpen, setIsPriceOpen] = useState<boolean>(true)
   const [visibleCategories, setVisibleCategories] = useState<number>(4)
   const [selectedCategories, setSelectedCategories] = useState<number[]>([])
   const searchParams = useSearchParams()
   const selectedParam = searchParams?.getAll('selected[]') || []

   useEffect(() => {
      async function fetchCategories() {
         const response = await fetch('/api/categories')
         const data = await response.json()
         setCategories(data)

         const categoryMapping = data.reduce(
            (acc: Record<number, string>, category: { id: number; name: string }) => {
               acc[category.id] = category.name
               return acc
            },
            {} as Record<number, string>,
         ) // Rzutowanie pustego obiektu jako mapa
         setCategoriesMap(categoryMapping)
      }
      fetchCategories()
   }, [])

   useEffect(() => {
      async function fetchProducts() {
         setLoading(true)
         const response = await fetch('/api/products')
         const data: Product[] = await response.json()
         setProducts(data)
         setFilteredProducts(data)
         setLoading(false)
      }
      fetchProducts()
   }, [])

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
      let filtered = products

      if (selectedCategories.length > 0) {
         filtered = filtered.filter(product => selectedCategories.includes(product.categoryId))
      }

      if (priceRange.min) {
         filtered = filtered.filter(product => product.price >= parseFloat(priceRange.min))
      }
      if (priceRange.max) {
         filtered = filtered.filter(product => product.price <= parseFloat(priceRange.max))
      }

      if (sortBy === 'price_asc') {
         filtered = filtered.sort((a, b) => a.price - b.price)
      } else if (sortBy === 'price_desc') {
         filtered = filtered.sort((a, b) => b.price - a.price)
      } else if (sortBy === 'latest') {
         filtered = filtered.sort((a, b) => {
            const dateA = new Date(a.createdAt).getTime() || 0
            const dateB = new Date(b.createdAt).getTime() || 0
            return dateB - dateA
         })
      }

      setFilteredProducts(filtered)

      setTotalPages(Math.ceil(filtered.length / showPerPage))
   }, [selectedCategories, priceRange, sortBy, products, showPerPage])

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

   return (
      <div className='mx-auto max-w-7xl px-4 py-8'>
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
                     // setSelectedCategories={setSelectedCategories}
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
                        <Label variant='custom' className='text-xl font-semibold'>
                           Sort By:
                        </Label>
                        <SortBySelect sortBy={sortBy} setSortBy={setSortBy} />
                     </div>

                     <div className='flex gap-x-4'>
                        <Label variant='custom' className='text-xl font-semibold'>
                           Show:
                        </Label>
                        <ShowPerPageSelect
                           showPerPage={showPerPage}
                           setShowPerPage={setShowPerPage}
                           setCurrentPage={setCurrentPage}
                        />
                     </div>
                  </div>
                  {loading ? (
                     <p className='text-center text-lg text-gray-500'>Ładowanie produktów...</p>
                  ) : (
                     <div className='grid grid-cols-3 gap-x-12 gap-y-8 px-10'>
                        {paginatedProducts.map(product => (
                           <div
                              key={product.id}
                              className='relative z-10 cursor-pointer overflow-hidden rounded-md border border-[var(--color-gray-800)] bg-[var(--color-base-gray)]'
                           >
                              <Link href={`/add-to-cart/${product.id}`}>
                                 <div className='absolute top-8 left-8 z-10 flex h-8 w-8 items-center justify-center rounded-md bg-[var(--color-base-gray)]'>
                                    <CartIcon />
                                 </div>
                              </Link>
                              <Link key={product.id} href={`/product/${product.id}`}>
                                 <div className='relative px-4 pt-4'>
                                    <img
                                       src={product.imageUrl?.[0] || 'https://i.ibb.co/xtWHYY7v/brak-zdjecia.png'}
                                       alt={product.name}
                                       className='h-48 w-full rounded-md object-cover'
                                    />
                                 </div>
                                 <div className='flex flex-col gap-y-4 px-4 pt-[18px] pb-5'>
                                    <Button
                                       variant={'fill'}
                                       size={'XS'}
                                       className='h-auto bg-[var(--color-blazeOrange-600)] px-2.5 py-1.5 text-sm font-medium text-[var(--color-primary-100)]'
                                    >
                                       {categoriesMap[product.categoryId] || 'Unknown'}
                                    </Button>
                                    <div className='flex flex-col gap-y-2'>
                                       <h2 className='text-lg font-medium text-[var(--color-neutral-900)]'>
                                          {product.name}
                                       </h2>
                                       <p className='text-[28px] font-semibold text-[var(--color-neutral-900)]'>
                                          ${product.price}
                                       </p>
                                    </div>
                                 </div>
                              </Link>
                           </div>
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
