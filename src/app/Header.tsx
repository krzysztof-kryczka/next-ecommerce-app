'use client'
import React, { JSX, useEffect, useState } from 'react'
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

const Header = (): JSX.Element => {
   const { data: session } = useSession()
   const pathname = usePathname()

   return (
      <header className='mx-auto max-w-[1440px] px-6 py-4 sm:px-10 sm:py-8'>
         <div className='flex flex-col gap-y-6 sm:gap-y-8'>
            <div className='flex flex-wrap items-center justify-between'>
               {/* Logo */}
               <div className='logo flex-shrink-0'>
                  <Text as='a' variant='h4semiBold' href='/'>
                     <span className='text-[var(--color-primary-400)]'>Devstock</span>
                     <span className='text-[var(--color-neutral-900)]'>Hub</span>
                  </Text>
               </div>

               {/* Akcje użytkownika */}
               {session ? (
                  <div className='flex items-center gap-x-5 sm:gap-x-7'>
                     {/* Ikona koszyka */}
                     <Link href='/cart'>
                        <CartIcon />
                     </Link>

                     {/* Menu użytkownika */}
                     <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                           <button className='h-8 w-8 cursor-pointer overflow-hidden rounded-full sm:h-10 sm:w-10'>
                              <Image
                                 src={
                                    session?.user?.image ||
                                    'https://i.ibb.co/VpPFKGR4/55335c708ac05d8f469894d08e2671fa.jpg'
                                 }
                                 alt={session.user?.email || 'Default User Avatar'}
                                 width={40}
                                 height={40}
                                 className='rounded-full'
                              />
                           </button>
                        </DropdownMenuTrigger>

                        <DropdownMenuContent
                           align='end'
                           className='w-48 rounded-md border border-[var(--color-gray-800)] bg-[var(--color-base-gray)] p-2 shadow-xl sm:w-56 lg:w-64'
                        >
                           {/* Profil */}
                           <DropdownMenuItem asChild>
                              <Link
                                 href='/user-profile'
                                 className='flex w-full cursor-pointer items-center gap-x-2 rounded-md px-3 py-2 text-[var(--color-neutral-100)] hover:bg-[var(--color-gray-700)]'
                              >
                                 👤 Profile
                              </Link>
                           </DropdownMenuItem>

                           {/* Ustawienia */}
                           <DropdownMenuItem asChild>
                              <Link
                                 href='#'
                                 className='flex w-full cursor-pointer items-center gap-x-2 rounded-md px-3 py-2 text-[var(--color-neutral-100)] hover:bg-[var(--color-gray-700)]'
                              >
                                 ⚙️ Settings
                              </Link>
                           </DropdownMenuItem>

                           {/* Pomoc */}
                           <DropdownMenuItem asChild>
                              <Link
                                 href='#'
                                 className='flex w-full cursor-pointer items-center gap-x-2 rounded-md px-3 py-2 text-[var(--color-neutral-100)] hover:bg-[var(--color-gray-700)]'
                              >
                                 ❓ Help Center
                              </Link>
                           </DropdownMenuItem>

                           <Separator className='my-5 bg-[var(--color-gray-800)]' />

                           {/* Wylogowanie */}
                           <DropdownMenuItem
                              className='flex items-center gap-x-2 rounded-md px-3 py-2 text-[var(--color-danger-400)] hover:bg-red-600 hover:text-white'
                              onClick={() => signOut()}
                           >
                              🚪 Log Out
                           </DropdownMenuItem>
                        </DropdownMenuContent>
                     </DropdownMenu>
                  </div>
               ) : (
                  <Link href='/login'>
                     <Button variant='fill' className="h-[54px]" asChild>
                        <button>Sign In</button>
                     </Button>
                  </Link>
               )}
            </div>

            {/* Nawigacja */}
            <nav className='flex'>
               <ul className='flex justify-center gap-3 sm:gap-4 lg:justify-start lg:gap-12'>
                  {headerNavLinks.map(link => (
                     <li key={link.href}>
                        <Text
                           as='a'
                           variant='textMSemiBold'
                           href={link.href}
                           className={
                              pathname === link.href
                                 ? 'text-[var(--color-primary-400)]'
                                 : 'text-[var(--color-neutral-300)] hover:text-[var(--color-primary-400)]'
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

export default Header
