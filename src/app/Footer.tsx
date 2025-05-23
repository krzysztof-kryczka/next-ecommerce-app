import ApplePayIcon from '@/components/icons/ApplePayIcon'
import GooglePayIcon from '@/components/icons/GooglePayIcon'
import MastercardIcon from '@/components/icons/MastercardIcon'
import PaypalIcon from '@/components/icons/PaypalIcon'
import VisaIcon from '@/components/icons/VisaIcon'
import Text from '@/components/ui/text'
import { footerNavLinks } from '@/data/navigationData'
import { JSX } from 'react'

const Footer = (): JSX.Element => {
   return (
      <footer className='w-full bg-[var(--color-gray-50)]'>
         <div className='mx-auto flex max-w-[1440px] flex-col'>
            <div className='px-6 py-20 sm:px-8 sm:py-24 md:px-10 md:py-28 lg:py-[140px]'>
               <div className='grid grid-cols-1 sm:grid-cols-2'>
                  <div className='flex flex-col gap-y-6 text-center sm:text-left'>
                     <Text as='h3' variant='h3semiBold'>
                        <span className='text-[var(--color-primary-400)]'>Nexus</span>
                        <span className='text-[var(--color-neutral-900)]'>Hub</span>
                     </Text>
                     <Text as='p' variant='textMmedium'>
                        © 2023 NexusHub. All rights reserved.
                     </Text>
                     <div className='flex justify-center gap-x-3 sm:justify-start'>
                        <VisaIcon />
                        <MastercardIcon />
                        <PaypalIcon />
                        <ApplePayIcon />
                        <GooglePayIcon />
                     </div>
                  </div>
                  <div className='grid grid-cols-1 gap-6 text-sm sm:grid-cols-2 sm:gap-8 md:grid-cols-4'>
                     {footerNavLinks.map(section => (
                        <div key={section.title}>
                           <Text as='h3' variant='h7semiBold' className='pb-6 text-[var(--color-neutral-900)] sm:pb-8'>
                              {section.title}
                           </Text>
                           <ul className='flex flex-col gap-3 text-base font-medium sm:gap-4'>
                              {section.links.map(link => (
                                 <li key={link.label}>
                                    <Text
                                       as='a'
                                       variant='textMmedium'
                                       href={link.href}
                                       className='text-[var(--color-neutral-100)]'
                                    >
                                       {link.label}
                                    </Text>
                                 </li>
                              ))}
                           </ul>
                        </div>
                     ))}
                  </div>
               </div>
            </div>
         </div>
      </footer>
   )
}

export default Footer
