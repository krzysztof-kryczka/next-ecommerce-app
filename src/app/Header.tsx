'use client'
import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { useSession, signOut } from 'next-auth/react'
import CartIcon from '@/components/icons/CartIcon'
import Text from '@/components/ui/text'
import { usePathname } from 'next/navigation'
import { headerNavLinks } from '@/data/navigationData'
import { Separator } from '@/components/ui/separator'
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '@/components/ui/dropdown-menu'

export default function Header() {
   const { data: session } = useSession()
   const [isDesktop, setIsDesktop] = useState(false)
   const [isTablet, setIsTablet] = useState(false)
   const pathname = usePathname()

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
      <header className='mx-auto flex max-w-[1440px] flex-col px-10 py-8'>
         <div className='flex flex-col gap-y-10'>
            <div className='flex items-center justify-between'>
               <div className='logo'>
                  <Text as='a' variant='h3semiBold' href='/'>
                     <span className='text-[var(--color-primary-400)]'>Devstock</span>
                     <span className='text-[var(--color-neutral-900)]'>Hub</span>
                  </Text>
               </div>

               {session ? (
                  <div className='flex items-center gap-x-7'>
                     <Link href='/cart'>
                        <CartIcon />
                     </Link>
                     <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                           <button className='h-10 w-10 overflow-hidden rounded-full'>
                              <Image
                                 src={session.user?.image || '/avatar.png'}
                                 alt={session.user?.email || 'Default User Avatar'}
                                 width={40}
                                 height={40}
                                 className='rounded-full'
                              />
                           </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align='end'>
                           <DropdownMenuItem asChild>
                              <Link href='/user-profile'>Profile</Link>
                           </DropdownMenuItem>
                           <DropdownMenuItem onClick={() => signOut()}>Log Out</DropdownMenuItem>
                        </DropdownMenuContent>
                     </DropdownMenu>
                  </div>
               ) : (
                  <Link href='/login'>
                     <Button variant='text' size={buttonSize} asChild>
                        <button>Sign In</button>
                     </Button>
                  </Link>
               )}
            </div>

            <nav>
               <ul className='flex justify-center space-x-4 sm:justify-start'>
                  {headerNavLinks.map(link => (
                     <li key={link.href}>
                        <Text
                           as='a'
                           variant='textMSemiBold'
                           href={link.href}
                           className={
                              pathname === link.href
                                 ? 'text-[var(--color-primary-400)]'
                                 : 'text-[var(--color-neutral-300)]'
                           }
                        >
                           {link.label}
                        </Text>
                     </li>
                  ))}
               </ul>
            </nav>
            <Separator className='bg-[var(--color-gray-800)]' />
         </div>
      </header>
   )
}
