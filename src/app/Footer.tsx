import Image from 'next/image'

export default function Footer() {
   return (
      <footer className='bg-[var(--color-gray-50)] px-[60px] py-[140px] text-white'>
         <div className='grid grid-cols-1 md:grid-cols-2'>
            <div className='flex flex-col gap-y-6'>
               <p className='semi-bold text-[40px]'>
                  <span className='text-[var(--color-primary-400)]'>Nexus</span>
                  <span className='text-[var(--color-base-white)]'>Hub</span>
               </p>
               <p className='text-sm'>© 2023 NexusHub. All rights reserved.</p>
               <div className='flex gap-x-3'>
                  <Image src='/visa.svg' alt='Visa' width={47} height={30} />
                  <Image src='/mastercard.svg' alt='Mastercard' width={47} height={30} />
                  <Image src='/paypal.svg' alt='PayPal' width={47} height={30} />
                  <Image src='/apple_pay.svg' alt='Apple Pay' width={47} height={30} />
                  <Image src='/google_pay.svg' alt='Google Pay' width={47} height={30} />
               </div>
            </div>
            <div className='grid grid-cols-2 gap-8 text-sm md:grid-cols-4'>
               <div>
                  <h3 className='pb-8 text-xl font-semibold'>Company</h3>
                  <ul className='flex flex-col gap-4 text-base font-medium'>
                     <li>
                        <a href='#' className='hover:underline'>
                           About Us
                        </a>
                     </li>
                     <li>
                        <a href='#' className='hover:underline'>
                           Contact
                        </a>
                     </li>
                     <li>
                        <a href='#' className='hover:underline'>
                           Partner
                        </a>
                     </li>
                  </ul>
               </div>
               <div>
                  <h3 className='pb-8 text-xl font-semibold'>Social</h3>
                  <ul className='flex flex-col gap-4 text-base font-medium'>
                     <li>
                        <a href='#' className='hover:underline'>
                           Instagram
                        </a>
                     </li>
                     <li>
                        <a href='#' className='hover:underline'>
                           Twitter
                        </a>
                     </li>
                     <li>
                        <a href='#' className='hover:underline'>
                           Facebook
                        </a>
                     </li>
                     <li>
                        <a href='#' className='hover:underline'>
                           LinkedIn
                        </a>
                     </li>
                  </ul>
               </div>
               <div>
                  <h3 className='pb-8 text-xl font-semibold'>FAQ</h3>
                  <ul className='flex flex-col gap-4 text-base font-medium'>
                     <li>
                        <a href='#' className='hover:underline'>
                           Account
                        </a>
                     </li>
                     <li>
                        <a href='#' className='hover:underline'>
                           Deliveries
                        </a>
                     </li>
                     <li>
                        <a href='#' className='hover:underline'>
                           Orders
                        </a>
                     </li>
                     <li>
                        <a href='#' className='hover:underline'>
                           Payments
                        </a>
                     </li>
                  </ul>
               </div>
               <div>
                  <h3 className='pb-8 text-xl font-semibold'>Resources</h3>
                  <ul className='flex flex-col gap-4 text-base font-medium'>
                     <li>
                        <a href='#' className='hover:underline'>
                           E-books
                        </a>
                     </li>
                     <li>
                        <a href='#' className='hover:underline'>
                           Tutorials
                        </a>
                     </li>
                     <li>
                        <a href='#' className='hover:underline'>
                           Courses
                        </a>
                     </li>
                     <li>
                        <a href='#' className='hover:underline'>
                           Blog
                        </a>
                     </li>
                  </ul>
               </div>
            </div>
         </div>
      </footer>
   )
}
