import {
   Breadcrumb as BreadcrumbUI,
   BreadcrumbItem,
   BreadcrumbLink,
   BreadcrumbList,
   BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'

const Breadcrumb = ({ paths }: { paths: { name: string; href: string }[] }) => {
   return (
      <BreadcrumbUI>
         <BreadcrumbList>
            {paths.map((path, index) => (
               <BreadcrumbItem key={index}>
                  <BreadcrumbLink
                     className={
                        index === paths.length - 1
                           ? 'text-base font-medium text-[var(--color-neutral-900)]'
                           : 'text-base font-medium text-[var(--color-neutral-300)]'
                     }
                     href={path.href}
                  >
                     {path.name}{' '}
                  </BreadcrumbLink>
                  {index < paths.length - 1 && <BreadcrumbSeparator className='text-[var(--color-neutral-300)]' />}
               </BreadcrumbItem>
            ))}
         </BreadcrumbList>
      </BreadcrumbUI>
   )
}

export default Breadcrumb
