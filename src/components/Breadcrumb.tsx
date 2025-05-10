import React, { JSX } from 'react'
import {
   Breadcrumb as BreadcrumbUI,
   BreadcrumbItem,
   BreadcrumbLink,
   BreadcrumbList,
   BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { BreadcrumbProps } from '@/types/BreadcrumbProps'

const Breadcrumb = ({ paths }: BreadcrumbProps): JSX.Element => {
   return (
      <BreadcrumbUI>
         <BreadcrumbList>
            {paths.map((path, index) => (
               <React.Fragment key={index}>
                  <BreadcrumbItem>
                     <BreadcrumbLink
                        className={
                           index === paths.length - 1
                              ? 'text-base font-medium text-[var(--color-neutral-900)]'
                              : 'text-base font-medium text-[var(--color-neutral-300)]'
                        }
                        href={path.href}
                     >
                        {path.name}
                     </BreadcrumbLink>
                  </BreadcrumbItem>
                  {/* Renderujemy separator poza elementem BreadcrumbItem */}
                  {index < paths.length - 1 && (
                     <li role='presentation'>
                        <BreadcrumbSeparator className='text-[var(--color-neutral-300)]' />
                     </li>
                  )}
               </React.Fragment>
            ))}
         </BreadcrumbList>
      </BreadcrumbUI>
   )
}

export default Breadcrumb
