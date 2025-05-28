import { JSX } from 'react'
import {
   Pagination as PaginationUI,
   PaginationContent,
   PaginationEllipsis,
   PaginationItem,
   PaginationLink,
} from '@/components/ui/pagination'
import { Button } from './ui/button'
import ArrowLeftIcon from './icons/ArrowLeftIcon'
import ArrowRightIcon from './icons/ArrowRightIcon'
import { PaginationProps } from '@/types/PaginationProps'

const Pagination = ({
   currentPage,
   totalPages,
   setCurrentPage,
   getPaginationButtons,
}: PaginationProps): JSX.Element => {
   const handlePrevPage = () => {
      scrollToTop()
      setTimeout(() => {
         setCurrentPage(prev => Math.max(prev - 1, 1))
      }, 1000)
   }

   const handleNextPage = () => {
      scrollToTop()
      setTimeout(() => {
         setCurrentPage(prev => Math.min(prev + 1, totalPages))
      }, 1000)
   }

   const scrollToTop = () => {
      window.scrollTo({ top: 0, behavior: 'smooth' })
   }

   return (
      <div className='mt-2 flex items-center justify-between p-10'>
         {/* Lewa strona – numery stron */}
         <div className='flex'>
            <PaginationUI>
               <PaginationContent>
                  {getPaginationButtons(currentPage, totalPages).map((page, index) =>
                     page === '...' ? (
                        <PaginationItem key={`ellipsis-${index}`}>
                           <PaginationEllipsis />
                        </PaginationItem>
                     ) : (
                        <PaginationItem key={`page-${page}-${index}`}>
                           <PaginationLink
                              href='#'
                              onClick={e => {
                                 e.preventDefault()
                                 setCurrentPage(Number(page))
                                 scrollToTop()
                              }}
                              className={`rounded-md px-[17px] py-[9px] text-base font-medium text-[var(--color-neutral-300)] ${
                                 currentPage === page
                                    ? 'bg-[var(--color-primary-400)] text-[var(--color-base-gray)]'
                                    : 'hover:bg-gray-100'
                              }`}
                           >
                              {page}
                           </PaginationLink>
                        </PaginationItem>
                     ),
                  )}
               </PaginationContent>
            </PaginationUI>
         </div>

         {/* Prawa strona – przyciski Previous i Next */}
         <div className='flex items-center justify-end'>
            <PaginationUI>
               <PaginationContent>
                  <Button
                     variant='stroke'
                     aria-label='Go to previous page'
                     className='border-[var(--color-neutral-900)] text-[var(--color-neutral-900)] hover:bg-gray-100'
                     onClick={handlePrevPage}
                     disabled={currentPage === 1}
                  >
                     <ArrowLeftIcon /> Previous
                  </Button>
                  <Button
                     variant='stroke'
                     aria-label='Go to next page'
                     className='border-[var(--color-neutral-900)] text-[var(--color-neutral-900)] hover:bg-gray-100'
                     onClick={handleNextPage}
                     disabled={currentPage === totalPages}
                  >
                     Next <ArrowRightIcon />
                  </Button>
               </PaginationContent>
            </PaginationUI>
         </div>
      </div>
   )
}

export default Pagination
