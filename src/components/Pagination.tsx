import React from 'react'
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

const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, setCurrentPage, getPaginationButtons }) => {
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
                              onClick={() => setCurrentPage(Number(page))}
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
                     className='border-[var(--color-neutral-900)] text-[var(--color-neutral-900)] hover:bg-gray-100'
                     onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  >
                     <ArrowLeftIcon /> Previous
                  </Button>
                  <Button
                     variant='stroke'
                     className='border-[var(--color-neutral-900)] text-[var(--color-neutral-900)] hover:bg-gray-100'
                     onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
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
