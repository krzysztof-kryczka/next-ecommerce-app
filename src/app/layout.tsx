import { SessionProvider } from '@/components/SessionProvider'
import { ToastContainer } from 'react-toastify'
import Header from './Header'
import Footer from './Footer'
import 'react-toastify/dist/ReactToastify.css'
import './globals.css'

export default function RootLayout({ children, }: Readonly<{ children: React.ReactNode }>) {
   return (
      <html lang='en'>
         <body className='antialiased'>
            <SessionProvider>
               <Header />
               <main>{children}</main>
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
