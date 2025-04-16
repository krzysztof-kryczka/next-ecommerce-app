'use client'
import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { useSession, signOut } from 'next-auth/react'

export default function Header() {
   const { data: session } = useSession()
   const [isDesktop, setIsDesktop] = useState(false)
   const [isTablet, setIsTablet] = useState(false)

   useEffect(() => {
      const handleResize = () => {
         const width = window.innerWidth
         setIsDesktop(width >= 1024)
         setIsTablet(width >= 640 && width < 1024)
      }

      handleResize()
      window.addEventListener('resize', handleResize)

      return () => window.removeEventListener('resize', handleResize)
   }, [])

   const buttonSize = isDesktop ? 'XXL' : isTablet ? 'M' : 'XS'

   return (
      <header className='px-10 py-8'>
         <div className='flex items-center justify-between'>
            <div className='logo'>
               <Link href='/'>
                  <Image src='/logo.svg' alt='E-commerce Logo' width={120} height={40} />
               </Link>
            </div>

            {session ? (
               <div className='flex items-center space-x-4'>
                  <Link href='/cart'>
                     <button aria-label='Shopping Cart'>
                        <Image src='/cart.svg' alt='Cart Icon' width={24} height={24} />
                     </button>
                  </Link>

                  <Link href='/user-panel'>
                     <Image
                        src={session.user?.image || '/avatar.png'}
                         alt={session.user?.email || 'Default User Avatar'}
                        width={40}
                        height={40}
                        className='rounded-full'
                     />
                  </Link>

                  <Button variant='text' size={buttonSize} onClick={() => signOut()}>
                     Log Out
                  </Button>
               </div>
            ) : (
               <Link href='/login'>
                  <Button variant='text' size={buttonSize} asChild>
                     <button>Sign In</button>
                  </Button>
               </Link>
            )}
         </div>

         <nav className='mt-6'>
            <ul className='flex justify-center space-x-4 sm:justify-start'>
               <li>
                  <Link href='/'>Home</Link>
               </li>
               <li>
                  <Link href='/products'>Products</Link>
               </li>
            </ul>
         </nav>
         <hr className='mt-4 border-t border-gray-300' />
      </header>
   )
}
