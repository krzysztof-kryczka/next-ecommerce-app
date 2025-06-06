import { SessionProvider } from '@/components/SessionProvider'
import { ToastContainer } from 'react-toastify'
import Header from './Header'
import Footer from './Footer'
import 'react-toastify/dist/ReactToastify.css'
import './globals.css'
import { Inter } from 'next/font/google'
import { CategoriesProvider } from '@/context/CategoriesContext'
import { CurrencyProvider } from '@/context/CurrencyContext'
import { JSX, Suspense } from 'react'
import { Analytics } from '@vercel/analytics/next'
import { SpeedInsights } from '@vercel/speed-insights/next'

const inter = Inter({ subsets: ['latin'] })

const RootLayout = ({ children }: Readonly<{ children: React.ReactNode }>): JSX.Element => {
   return (
      <html lang='en'>
         <body className={`${inter.className} antialiased`}>
            <SessionProvider>
               <Header />
               <CurrencyProvider>
                  <CategoriesProvider>
                     <Suspense fallback={<p>Loading...</p>}>
                        <main className='mx-auto flex max-w-[1440px] flex-col gap-y-[100px] pb-20'>{children}</main>
                        <Analytics />
                        <SpeedInsights />
                     </Suspense>
                  </CategoriesProvider>
               </CurrencyProvider>
               <Footer />
               <ToastContainer
                  position='top-right'
                  autoClose={5000}
                  hideProgressBar={false}
                  newestOnTop={false}
                  closeOnClick
                  rtl={false}
                  pauseOnFocusLoss
                  draggable
                  pauseOnHover
               />
            </SessionProvider>
         </body>
      </html>
   )
}

export default RootLayout
