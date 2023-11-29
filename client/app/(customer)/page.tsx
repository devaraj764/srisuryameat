import Banner from '@/components/home/Banner'
import Contact from '@/components/home/Contact'
import OurServices from '@/components/home/OurServices'
import Quotation from '@/components/home/Quotation'
import WeProvide from '@/components/home/WeProvide'

export default function Home() {
  return (
    <main className="h-full">
      <Banner />
      <WeProvide />
      <Quotation />
      <OurServices />
      <Contact />
    </main>
  )
}

