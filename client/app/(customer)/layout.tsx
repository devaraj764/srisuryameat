import type { Metadata } from 'next'
import { Poppins } from 'next/font/google'
import '@/app/globals.css'
import Provider from '@/components/common/Providers';
import { Toaster } from "@/components/ui/toaster"
import Navbar from '@/components/common/Navbar';
import Footer from '@/components/home/Footer';


const poppins = Poppins({ weight: ['500', '700'], subsets: ['devanagari'] })

export const metadata: Metadata = {
  title: 'Sri Surya Meat Hub',
  description: 'From farm to fork, we bring you the finest meats, handpicked for perfection. Satisfy your cravings with our succulent cuts, where quality meets taste in every bite.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body suppressHydrationWarning={true} className={poppins.className}>
        <Provider>
          <Navbar />
          {children}
        </Provider>
        <Toaster />
        <Footer />
      </body>
    </html>
  )
}
