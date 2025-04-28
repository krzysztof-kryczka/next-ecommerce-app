const brands = [
   { id: 1, name: 'ROG', logo: '/rog-logo.png' },
   { id: 2, name: 'Logitech', logo: '/logitech-logo.png' },
   { id: 3, name: 'JBL', logo: '/jbl-logo.png' },
]

export default function Brands() {
   return (
      <section className='bg-gray-100 py-10'>
         <h2 className='mb-6 text-center text-3xl font-semibold'>Our Brands</h2>
         <div className='flex flex-wrap justify-center gap-6'>
            {brands.map(brand => (
               <img key={brand.id} src={brand.logo} alt={brand.name} className='h-16 w-auto object-contain' />
            ))}
         </div>
      </section>
   )
}
