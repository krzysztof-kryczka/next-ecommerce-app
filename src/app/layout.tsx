import { SessionProvider } from '@/components/SessionProvider'
import { ToastContainer } from 'react-toastify'
import Header from './Header'
import Footer from './Footer'
import 'react-toastify/dist/ReactToastify.css'
import './globals.css'
import { Inter } from 'next/font/google'
import { CategoriesProvider } from '@/context/CategoriesContext'

const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
   return (
      <html lang='en'>
         <body className={`${inter.className} antialiased`}>
            <SessionProvider>
               <Header />
               <CategoriesProvider>
                  <main className='mx-auto flex max-w-[1440px] flex-col gap-y-[100px] pb-20'>{children}</main>
               </CategoriesProvider>
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
