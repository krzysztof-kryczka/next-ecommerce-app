import PlusSmallIcon from './icons/PlusSmallIcon'
import { CategoryListProps } from '@/types/CategoryListProps'

const CategoryList: React.FC<CategoryListProps> = ({
   selectedCategories,
   setSelectedCategories,
   categories,
   setCurrentPage,
   visibleCategories,
   setVisibleCategories,
}) => (
   <div className='pt-4'>
      <ul className='flex flex-col gap-y-5'>
         {/* Wszystkie */}
         <li
            className={`flex cursor-pointer text-base text-[var(--color-neutral-900)] hover:text-[var(--color-primary-400)] ${
               selectedCategories.length === 0 ? 'font-bold text-[var(--color-neutral-900)]' : ''
            }`}
            onClick={() => {
               setSelectedCategories([])
               setCurrentPage(1)
            }}
         >
            <div className='modal-order-service-checkbox relative'>
               <input
                  type='checkbox'
                  className='absolute opacity-0'
                  checked={selectedCategories.length === 0}
                  onChange={() => {
                     setSelectedCategories([])
                     setCurrentPage(1)
                  }}
               />
               <span className='checkmark -top-2'></span>
            </div>
            <span className='ml-12'>All</span>
         </li>

         {/* Pozostałe kategorie */}
         {categories.slice(0, visibleCategories).map(category => (
            <li
               key={category.id}
               className={`flex cursor-pointer text-base text-[var(--color-neutral-900)] hover:text-[var(--color-primary-400)] ${
                  selectedCategories.includes(category.id) ? 'font-bold text-[var(--color-neutral-900)]' : ''
               }`}
               onClick={() => {
                  if (selectedCategories.includes(category.id)) {
                     setSelectedCategories((prev: number[]) => prev.filter(id => id !== category.id))
                  } else {
                     setSelectedCategories(prev => [...prev, category.id])
                  }
                  setCurrentPage(1)
               }}
            >
               <div className='modal-order-service-checkbox relative'>
                  <input
                     type='checkbox'
                     className='absolute opacity-0'
                     checked={selectedCategories.includes(category.id)}
                     onChange={() => {
                        if (selectedCategories.includes(category.id)) {
                           setSelectedCategories(prev => prev.filter(id => id !== category.id))
                        } else {
                           setSelectedCategories(prev => [...prev, category.id])
                        }
                        setCurrentPage(1)
                     }}
                  />
                  <span className='checkmark -top-2'></span>
               </div>
               <span className='ml-12'>{category.name}</span>
            </li>
         ))}
      </ul>

      {/* Load More */}
      {visibleCategories < categories.length && (
         <div className='py-5'>
            <p
               onClick={() => setVisibleCategories(categories.length)}
               className='flex cursor-pointer items-center text-xl font-semibold text-[var(--color-neutral-900)]'
            >
               Load More
               <span className='pl-3.5'>
                  <PlusSmallIcon />
               </span>
            </p>
         </div>
      )}
   </div>
)

export default CategoryList
