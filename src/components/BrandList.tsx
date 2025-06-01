import { JSX } from 'react'
import { BrandListProps } from '@/types/BrandListProps'
import MinusIcon from './icons/MinusIcon'
import PlusIcon from './icons/PlusIcon'

const BrandList = ({
   selectedBrand,
   setSelectedBrand,
   brands,
   setCurrentPage,
   visibleBrands,
   setVisibleBrands,
}: BrandListProps): JSX.Element => {
   return (
      <div className='pt-4'>
         <ul className='flex flex-col gap-y-5'>
            {/* Lista marek */}
            {brands.slice(0, visibleBrands).map(brand => (
               <li
                  key={brand.id}
                  className={`flex cursor-pointer text-base text-[var(--color-neutral-900)] hover:text-[var(--color-primary-400)] ${
                     selectedBrand === brand.id ? 'font-bold text-[var(--color-neutral-900)]' : ''
                  }`}
                  onClick={() => {
                     setSelectedBrand(selectedBrand === brand.id ? null : brand.id)
                     setCurrentPage(1)
                  }}
               >
                  <div className='modal-order-service-checkbox relative'>
                     <input
                        type='checkbox'
                        className='absolute opacity-0'
                        checked={selectedBrand === brand.id}
                        onChange={() => {
                           setSelectedBrand(selectedBrand === brand.id ? null : brand.id)
                           setCurrentPage(1)
                        }}
                     />
                     <span className='checkmark -top-2'></span>
                  </div>
                  <span className='ml-12'>{brand.name}</span>
               </li>
            ))}
         </ul>

         {/* Load More */}
         <div className='py-5'>
            <p
               onClick={() => setVisibleBrands(prev => (prev === brands.length ? 4 : brands.length))}
               className='flex cursor-pointer items-center text-xl font-semibold text-[var(--color-neutral-900)]'
            >
               {visibleBrands === brands.length ? 'Load Less' : 'Load More'}
               <span className='pl-3.5'>{visibleBrands === brands.length ? <MinusIcon /> : <PlusIcon />}</span>
            </p>
         </div>
      </div>
   )
}

export default BrandList
